"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Container, Title, Tabs, Grid, Card as MantineCard, Badge, Button, ScrollArea, Group, Text, Progress, Stack, Flex, Center, Loader, Modal, TextInput, ActionIcon } from '@mantine/core';
import { Trash2, Edit2, Play } from 'lucide-react';
import { useGameStore } from '../engine/store';
import { SoundEngine } from '../engine/soundEngine';
import { useSocket } from '../components/SocketProvider';
import cardsData from '../../data/cards.json';
import type { Card } from '../types';
import { GameCard3D } from '../components/game/ui/Card';

const CHARACTERS = [
  { id: 'warrior', name: '전사' },
  { id: 'esper', name: '에스퍼' },
  { id: 'archer', name: '궁수' },
  { id: 'jumper', name: '점퍼' },
  { id: 'prophet', name: '예언가' },
];

interface DeckData {
    id: string;
    name: string;
    character: string;
    cards: string[];
    createdAt: string;
}

export default function LobbyScreen() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const initGame = useGameStore((s) => s.initGame);

  const [selectedChar, setSelectedChar] = useState<string>('warrior');
  const [deck, setDeck] = useState<string[]>([]);

  // 다중 덱 관리 상태
  const [decks, setDecks] = useState<DeckData[]>([]);
  const [editingDeckId, setEditingDeckId] = useState<string | null>(null);
  
  // 모달 제어 상태
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [newDeckName, setNewDeckName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // 소켓 및 매칭 상태
  const socket = useSocket();
  const [isMatching, setIsMatching] = useState(false);

  // 미인증 라우팅
  useEffect(() => {
      if (status === 'unauthenticated') {
          router.push('/login');
      }
  }, [status, router]);

  // 접속 시 덱 리스트 로드
  const fetchDecks = async () => {
      try {
          const res = await fetch('/api/deck');
          if (res.ok) {
              const data = await res.json();
              setDecks(data.decks || []);
          }
      } catch (e) {
          console.error('Failed to load decks', e);
      }
  };

  useEffect(() => {
      if (status === 'authenticated') {
          fetchDecks();
      }
  }, [status]);

  // 소켓 매칭 완료 리스너
  useEffect(() => {
      if (!socket) return;
      
      const onMatchFound = (data: any) => {
          console.log('[Lobby] MATCH_FOUND!', data);
          setIsMatching(false);
          // 서버 초기 상태 덮어쓰기
          useGameStore.getState().syncState(data.state, data.myId);
          router.push('/game');
      };

      socket.on('MATCH_FOUND', onMatchFound);
      return () => { socket.off('MATCH_FOUND', onMatchFound); };
  }, [socket, router]);

  // 로비 BGM
  useEffect(() => {
    SoundEngine.preload();
    const playLobbyBgm = () => {
        SoundEngine.playBGM('bgm_lobby');
        window.removeEventListener('click', playLobbyBgm);
    };
    window.addEventListener('click', playLobbyBgm);
    return () => window.removeEventListener('click', playLobbyBgm);
  }, []);

  const allCards = cardsData.cards as unknown as Card[];
  const availableCards = allCards.filter(c => (c.scope === 'common' || c.scope === selectedChar) && (c.max_count !== undefined && c.max_count > 0));

  const handleCharChange = (val: string | null) => {
    if (!val) return;
    SoundEngine.play('ui_button_click');
    setSelectedChar(val);
    const validDeck = deck.filter(id => {
      const card = allCards.find(c => c.id === id);
      return card && (card.scope === 'common' || card.scope === val);
    });
    setDeck(validDeck);
    setEditingDeckId(null); // 캐릭터 변경 시 새 덱 작성 취급
  };

  const handleAddCard = (cardId: string) => {
    if (deck.length >= 20) { SoundEngine.play('ui_error'); return; }
    const cardInfo = allCards.find(c => c.id === cardId);
    if (!cardInfo) return;
    const currentCount = deck.filter(id => id === cardId).length;
    if (currentCount >= (cardInfo.max_count || 3)) { SoundEngine.play('ui_error'); return; }

    SoundEngine.play('ui_card_select');
    setDeck([...deck, cardId]);
  };

  const handleRemoveCard = (index: number) => {
    SoundEngine.play('action_discard');
    const newDeck = [...deck];
    newDeck.splice(index, 1);
    setDeck(newDeck);
  };

  const handleStartGame = () => {
    if (deck.length !== 20 || !socket) {
        console.error('[Lobby] 매칭 시작 실패: 덱이 20장이 아니거나 소켓이 연결되지 않음', { deckLen: deck.length, socketConnected: !!socket });
        return;
    }
    console.log('[Lobby] 매칭 요청 발송! MATCH_FIND:', { charId: selectedChar, deckLen: deck.length, socketId: socket.id });
    SoundEngine.play('ui_turn_ready');
    setIsMatching(true);
    socket.emit('MATCH_FIND', { charId: selectedChar, deck });
  };

  // 덱 저장 (POST or PUT)
  const executeSaveDeck = async () => {
      if (deck.length !== 20 || !newDeckName.trim()) return;
      setIsSaving(true);
      
      try {
          const method = editingDeckId ? 'PUT' : 'POST';
          const url = editingDeckId ? `/api/deck/${editingDeckId}` : '/api/deck';
          
          const res = await fetch(url, {
              method,
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name: newDeckName, character: selectedChar, cards: deck })
          });
          
          if (res.ok) {
              await fetchDecks();
              setIsSaveModalOpen(false);
              setNewDeckName('');
              // 저장 후 편집 모드 유지 (응답에서 새 ID를 받는다면 갱신 가능하나 편의상 fetchDecks 의존)
          } else {
              alert('덱 저장에 실패했습니다.');
          }
      } catch (err) {
          console.error(err);
          alert('네트워크 오류가 발생했습니다.');
      } finally {
          setIsSaving(false);
      }
  };

  // 모달 열기 핸들러
  const openSaveModal = () => {
      if (editingDeckId) {
          const currentEditingDeck = decks.find(d => d.id === editingDeckId);
          setNewDeckName(currentEditingDeck?.name || '내 덱');
      } else {
          setNewDeckName(`${CHARACTERS.find(c => c.id === selectedChar)?.name} 덱 1`);
      }
      setIsSaveModalOpen(true);
  };

  // 특정 덱으로 편집 (LOAD)
  const handleEditDeck = (d: DeckData) => {
      setSelectedChar(d.character);
      setDeck(d.cards);
      setEditingDeckId(d.id);
      setIsListModalOpen(false);
  };

  // 특정 덱 삭제
  const handleDeleteDeck = async (id: string) => {
      if (!confirm('이 덱을 영구히 삭제하시겠습니까?')) return;
      try {
          const res = await fetch(`/api/deck/${id}`, { method: 'DELETE' });
          if (res.ok) {
              await fetchDecks();
              if (editingDeckId === id) setEditingDeckId(null);
          } else {
              alert('덱 삭제 실패');
          }
      } catch (e) {
          console.error(e);
      }
  };

  const handleStartWithSpecificDeck = (d: DeckData) => {
      if (!socket) {
          console.error('[Lobby] 특정 덱 매칭 시작 실패: 소켓이 연결되지 않음');
          return;
      }
      console.log(`[Lobby] 특정 덱 매칭 발송! MATCH_FIND:`, { charId: d.character, deckLen: d.cards.length, socketId: socket.id });
      SoundEngine.play('ui_turn_ready');
      setIsMatching(true);
      socket.emit('MATCH_FIND', { charId: d.character, deck: d.cards });
      setIsListModalOpen(false);
  };

  if (status === 'loading' || status === 'unauthenticated') {
      return (
          <Center style={{ width: '100vw', height: '100vh', flexDirection: 'column', gap: '20px' }}>
              <Loader color="violet" size="xl" type="bars" />
              <Title order={3} c="dimmed">인증 상태를 확인하고 있습니다...</Title>
          </Center>
      );
  }

  return (
    <Container size="xl" py="xl">
      <Flex direction="column" gap="xl">
        <Title order={1} c="blue.4" ta="center" style={{ letterSpacing: '4px' }}>DECK BUILDER LOBBY</Title>

        <Grid gutter="xl">
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Group justify="space-between" mb="lg">
                <Tabs value={selectedChar} onChange={handleCharChange} variant="pills" color="indigo" radius="xl" style={{ flex: 1 }}>
                <Tabs.List grow>
                    {CHARACTERS.map(char => (
                    <Tabs.Tab key={char.id} value={char.id} fz="md" fw={700}>{char.name}</Tabs.Tab>
                    ))}
                </Tabs.List>
                </Tabs>
                <Button variant="light" color="violet" size="md" radius="xl" onClick={() => setIsListModalOpen(true)}>
                    👀 전체 마이덱 보기 ({decks.length}개)
                </Button>
            </Group>

            <ScrollArea h="calc(100vh - 220px)" type="auto" offsetScrollbars>
              <Grid>
                {availableCards.map(card => {
                  const countInDeck = deck.filter(id => id === card.id).length;
                  const maxCount = card.max_count || 3;
                  const isFull = deck.length >= 20;
                  const isLimit = countInDeck >= maxCount;

                  return (
                    <Grid.Col span={{ base: 6, sm: 4, md: 3, lg: 3 }} key={card.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div 
                          style={{ transform: 'scale(1.00)', transformOrigin: 'top center', height: '220px', marginBottom: '10px' }}
                          onMouseEnter={() => { if (!isFull && !isLimit) SoundEngine.play('ui_card_hover'); }}
                      >
                        <GameCard3D
                            card={card as Card}
                            disabled={isFull || isLimit}
                            onClick={() => handleAddCard(card.id)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            style={{ position: 'relative' }} 
                        />
                      </div>
                      <Badge color={isLimit ? 'red' : 'indigo'} variant="filled" size="md">
                          {countInDeck} / {maxCount}
                      </Badge>
                    </Grid.Col>
                  );
                })}
              </Grid>
            </ScrollArea>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <MantineCard shadow="md" radius="lg" bg="dark.6" withBorder h="100%" style={{ display: 'flex', flexDirection: 'column' }}>
              <Group justify="space-between" mb="sm">
                <Title order={3} c="gray.3">
                    {editingDeckId ? `편집 중: ${decks.find(d => d.id === editingDeckId)?.name}` : '새 덱 구성 중'}
                </Title>
                {editingDeckId && (
                    <Badge color="orange" variant="light" onClick={() => setEditingDeckId(null)} style={{ cursor: 'pointer' }}>
                        취소(새 덱)
                    </Badge>
                )}
              </Group>
              <Progress value={(deck.length / 20) * 100} color={deck.length === 20 ? 'green' : 'blue'} size="xl" radius="xl" striped={deck.length < 20} animated={deck.length < 20} mb="md" />
              <Text ta="right" size="sm" fw={700} mb="lg" c={deck.length === 20 ? 'green.4' : 'gray.5'}>
                {deck.length} / 20 Cards
              </Text>

              <ScrollArea style={{ flex: 1, minHeight: 0 }} offsetScrollbars scrollbarSize={8} p="xs">
                <Stack gap="xs">
                  {deck.map((id, index) => {
                    const c = allCards.find(card => card.id === id);
                    if (!c) return null;
                    return (
                      <Group key={`${id}-${index}`} justify="space-between" p="xs" bg="dark.5" style={{ borderRadius: '8px', cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.background = '#333'; SoundEngine.play('ui_card_hover'); }} onMouseLeave={(e) => e.currentTarget.style.background = 'var(--mantine-color-dark-5)'} onClick={() => handleRemoveCard(index)}>
                        <Text size="sm" fw={600} truncate w={150}>{c.name}</Text>
                        <Badge size="sm" color="red.9" variant="filled">{c.cost}</Badge>
                      </Group>
                    );
                  })}
                  {deck.length === 0 && <Text ta="center" c="dimmed" mt="xl">카드를 선택하여 덱을 구성하세요.</Text>}
                </Stack>
              </ScrollArea>

              <Stack gap="sm" mt="lg">
                  {/* 저장 버튼 (편집/신규 모달 트리거) */}
                  <Button 
                    fullWidth size="md" radius="md" 
                    color={deck.length === 20 ? (editingDeckId ? 'orange.5' : 'indigo.5') : 'dark.4'} 
                    onClick={openSaveModal} 
                    disabled={deck.length < 20} 
                    style={{ transition: 'all 0.3s ease' }}
                  >
                      {editingDeckId ? '현재 덱 업데이트' : '새 마이덱으로 저장'}
                  </Button>

                  {/* 현재 화면의 덱으로 게임 시작 버튼 */}
                  <Button 
                    fullWidth size="lg" radius="md" 
                    color={deck.length === 20 ? 'teal.5' : 'dark.4'} 
                    onClick={handleStartGame} 
                    disabled={deck.length < 20 || isMatching} 
                    loading={isMatching}
                    style={{ transition: 'all 0.3s ease', boxShadow: deck.length === 20 ? '0 0 15px rgba(32, 201, 151, 0.5)' : 'none' }}
                  >
                    {isMatching ? 'MATCHING...' : 'START BATTLE'}
                  </Button>
              </Stack>
            </MantineCard>
          </Grid.Col>
        </Grid>
      </Flex>

      {/* 덱 저장 모달 */}
      <Modal opened={isSaveModalOpen} onClose={() => setIsSaveModalOpen(false)} title={editingDeckId ? "마이덱 업데이트" : "마이덱 저장"} centered overlayProps={{ blur: 3 }}>
        <Stack gap="md">
            <TextInput 
                label="덱 이름" 
                placeholder="덱의 고유한 이름을 지어주세요" 
                value={newDeckName} 
                onChange={(e) => setNewDeckName(e.currentTarget.value)} 
                data-autofocus
            />
            {editingDeckId && (
                <Text size="sm" c="dimmed">
                    ※ 새로운 이름으로 변경하여 기존 덱에 덮어쓸 수 있습니다.<br/>
                    완전히 새로운 덱으로 저장하려면 우측 패널에서 '취소(새 덱)'을 누른 뒤 다시 시도해주세요.
                </Text>
            )}
            <Button color="indigo" fullWidth mt="md" loading={isSaving} onClick={executeSaveDeck} disabled={!newDeckName.trim()}>
                {editingDeckId ? '업데이트 저장' : '이름 정하고 저장'}
            </Button>
        </Stack>
      </Modal>

      {/* 마이덱 목록 보기 모달 */}
      <Modal opened={isListModalOpen} onClose={() => setIsListModalOpen(false)} title="내 마이덱 보관함" size="xl" centered overlayProps={{ blur: 3 }}>
          {decks.length === 0 ? (
              <Center py="xl"><Text c="dimmed">아직 저장된 덱이 없습니다. 멋진 덱을 만들어 직접 이름을 붙여보세요!</Text></Center>
          ) : (
              <Grid>
                  {decks.map(d => (
                      <Grid.Col span={{ base: 12, sm: 6 }} key={d.id}>
                          <MantineCard shadow="sm" radius="md" withBorder padding="md" bg="dark.7">
                              <Group justify="space-between" mb="xs">
                                  <Text fw={700} truncate style={{ flex: 1 }}>{d.name}</Text>
                                  <Badge color="violet">{CHARACTERS.find(c => c.id === d.character)?.name || d.character}</Badge>
                              </Group>
                              <Text size="xs" c="dimmed" mb="md">
                                  저장일: {new Date(d.createdAt).toLocaleDateString()}
                              </Text>

                              <Group grow>
                                  <Button size="xs" color="teal" leftSection={<Play size={14}/>} onClick={() => handleStartWithSpecificDeck(d)}>시작</Button>
                                  <Button size="xs" color="indigo" variant="light" leftSection={<Edit2 size={14}/>} onClick={() => handleEditDeck(d)}>편집</Button>
                                  <ActionIcon size="lg" color="red" variant="subtle" title="삭제" onClick={() => handleDeleteDeck(d.id)}>
                                      <Trash2 size={18} />
                                  </ActionIcon>
                              </Group>
                          </MantineCard>
                      </Grid.Col>
                  ))}
              </Grid>
          )}
      </Modal>
    </Container>
  );
}