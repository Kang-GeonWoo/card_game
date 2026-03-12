"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Group, ActionIcon, ScrollArea, Text, Center, Loader } from '@mantine/core';
import { X, Sword, MousePointer2, BookOpen, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../engine/store';
import { SoundEngine } from '../../engine/soundEngine'; // 💡 사운드 엔진 임포트
import { useSocket } from '../../components/SocketProvider';
import type { Action, Card } from '../../types';

import { PlayerStatus } from '../../components/game/ui/PlayerStatus';
import { FieldBoard } from '../../components/game/ui/FieldBoard';
import { HandSystem } from '../../components/game/ui/HandSystem';
import { TurnIndicator } from '../../components/game/ui/TurnIndicator';
import { GameCard3D } from '../../components/game/ui/Card';
import { ActionPanel, type ActionCommandType } from '../../components/game/ui/ActionPanel';
import { ActionDPad } from '../../components/game/ui/ActionDPad';
import { VFXManager } from '../../components/game/ui/VFXManager';

export default function GameBoard() {
    const store = useGameStore();
    const router = useRouter();
    const socket = useSocket();
    const myId = store.myId || socket?.id;
    const p1 = myId ? store.players[myId] : null;
    const opponentId = Object.keys(store.players).find(id => id !== myId);
    const p2 = opponentId ? store.players[opponentId] : null;

    const [targetingCardId, setTargetingCardId] = useState<string | null>(null);
    const [prevP1Hp, setPrevP1Hp] = useState(p1?.hp || 100);
    const [prevP2Hp, setPrevP2Hp] = useState(p2?.hp || 100);
    const [hoveredMapCell, setHoveredMapCell] = useState<{ x: number; y: number } | null>(null);

    const [currentCommand, setCurrentCommand] = useState<ActionCommandType | null>(null);
    const [turnLabel, setTurnLabel] = useState<string | null>(null);
    const [audioUnlocked, setAudioUnlocked] = useState(false);

    const logEndRef = useRef<HTMLDivElement>(null);
    useEffect(() => { logEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [store.logs]);

    useEffect(() => {
        if (store.status === 'lobby') router.push('/');
    }, [store.status, router]);

    // 서버 결괏값 리스너 (리플레이 재생)
    useEffect(() => {
        if (!socket) return;
        const onTurnResult = (data: any) => {
            console.log('[Socket] TURN_RESULT 수신 완료! 데이터:', data);
            if (data && data.snapshots && Array.isArray(data.snapshots)) {
                useGameStore.getState().playReplays(data.snapshots);
            } else {
                console.warn('[Socket] TURN_RESULT에 snapshots가 누락되었습니다.', data);
            }
        };
        socket.on('TURN_RESULT', onTurnResult);
        console.log('[Socket] TURN_RESULT listener registered 🎯');

        const onStateSync = (data: any) => {
            console.log('[Socket] STATE_SYNC 수신 완료', data);
            if (data && data.state) {
                useGameStore.getState().syncState(data.state);
            }
        }
        socket.on('STATE_SYNC', onStateSync);
        console.log('[Socket] STATE_SYNC listener registered 🎯');

        return () => { 
            socket.off('TURN_RESULT', onTurnResult); 
            socket.off('STATE_SYNC', onStateSync);
            console.log('[Socket] Listeners unregistered'); 
        };
    }, [socket]);

    // 강제 동기화 (재접속 대비 안전장치)
    useEffect(() => {
        if (socket && store.myId && socket.id && store.myId !== socket.id) {
            console.log(`[Sync] 소켓 ID 불일치 감지. (Store: ${store.myId}, Socket: ${socket.id}). 상태 동기화 요청.`);
            socket.emit('REQUEST_STATE_SYNC', { oldSocketId: store.myId });
        }
    }, [socket?.id, store.myId]);

    useEffect(() => {
        if (store.status === 'planning') setTurnLabel(!p1?.isReady ? "YOUR TURN" : "ENEMY TURN");
        else if (store.status === 'resolving') setTurnLabel("BATTLE PHASE");
        else if (store.status === 'discarding') setTurnLabel("DISCARD CARD");
    }, [store.status, store.turnCount, store.resolvingStep, p1?.isReady]);

    // 💡 패배/승리 사운드 재생
    useEffect(() => {
        if (store.status === 'game_over') {
            if (p1 && p1.hp > 0 && p2 && p2.hp <= 0) {
                SoundEngine.playBGM('bgm_victory');
            } else if (p1 && p1.hp <= 0 && p2 && p2.hp > 0) {
                SoundEngine.playBGM('bgm_defeat');
            } else {
                // 무승부 사운드가 명시되지 않았으므로 bgm_defeat 재생 혹은 중지 방어코드
                SoundEngine.playBGM('bgm_defeat');
            }
        }
    }, [store.status, p1?.hp, p2?.hp]);

    // BGM Audio Unlock Overlay
    if (!audioUnlocked && store.status !== 'lobby') {
        return (
            <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexDirection: 'column', gap: '20px' }}
                 onClick={() => { setAudioUnlocked(true); SoundEngine.playBGM('bgm_battle'); }}>
                <Sword size={64} color="#E6C36A" />
                <Text size="xl" fw={900} c="white" style={{ letterSpacing: '2px', textShadow: '0 0 10px #E6C36A' }}>화면을 클릭하여 전투에 진입하세요! (사운드 활성화)</Text>
            </div>
        );
    }

    if (store.status === 'lobby') return null;

    if (!p1 || !p2 || !myId) {
        return (
            <div style={{ position: 'fixed', inset: 0, backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Center style={{ flexDirection: 'column', gap: '20px' }}>
                    <Loader size="xl" color="violet" />
                    <Text c="white" size="lg" fw={700}>전장 데이터를 동기화 중...</Text>
                </Center>
            </div>
        );
    }

    const serverP1Id = Object.keys(store.players)[0];
    const amIServerP1 = myId === serverP1Id;
    const myResolvingSteps = amIServerP1 ? [0, 2, 4] : [1, 3, 5];
    const enemyResolvingSteps = amIServerP1 ? [1, 3, 5] : [0, 2, 4];

    const selectedCard = targetingCardId ? p1.hand.find(c => c.id === targetingCardId) : null;
    const targetingDef = selectedCard?.targeting ?? null;

    const getValidTargets = (targeting: typeof targetingDef, px: number, py: number): Set<string> => {
        const result = new Set<string>();
        if (!targetingCardId || !targeting) return result;
        const { type, cast_range } = targeting;
        for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 3; y++) {
                const dx = Math.abs(x - px);
                const dy = Math.abs(y - py);
                if (type === 'global' || cast_range === 99) result.add(`${x},${y}`);
                else if (type === 'line') { if ((dx === 0 || dy === 0) && (dx + dy <= cast_range)) result.add(`${x},${y}`); }
                else if (dx + dy <= cast_range) result.add(`${x},${y}`);
            }
        }
        return result;
    };

    const getVirtualPosition = (player: typeof p1) => {
        let { x, y } = player.position;
        player.actionQueue.forEach(a => {
            if (a && a.type === 'move') {
                if (a.targetX !== undefined && a.targetY !== undefined) { x = a.targetX; y = a.targetY; }
                else if (a.dx !== undefined && a.dy !== undefined) { x += a.dx; y += a.dy; }
            }
        });
        return { x: Math.max(0, Math.min(2, x)), y: Math.max(0, Math.min(2, y)) };
    };

    const virtualPos = getVirtualPosition(p1);
    const validTargets = getValidTargets(targetingDef, virtualPos.x, virtualPos.y);

    const getPreviewTiles = (targeting: typeof targetingDef, mx: number, my: number): Set<string> => {
        const result = new Set<string>();
        if (!targetingCardId || !targeting || !validTargets.has(`${mx},${my}`)) return result;
        const { aoe, type } = targeting;
        if (aoe === 0) result.add(`${mx},${my}`);
        else if (aoe === 1) {
            const adj = [{ dx: 0, dy: -1 }, { dx: 0, dy: 1 }, { dx: -1, dy: 0 }, { dx: 1, dy: 0 }, { dx: 0, dy: 0 }];
            adj.forEach(({ dx, dy }) => {
                const nx = mx + dx, ny = my + dy;
                if (nx >= 0 && nx < 3 && ny >= 0 && ny < 3) result.add(`${nx},${ny}`);
            });
        } else if (aoe >= 99) {
            for (let x = 0; x < 3; x++) for (let y = 0; y < 3; y++) result.add(`${x},${y}`);
        }
        return result;
    };

    const previewTiles = hoveredMapCell ? getPreviewTiles(targetingDef, hoveredMapCell.x, hoveredMapCell.y) : new Set<string>();
    const isInRange = (x: number, y: number): boolean => validTargets.has(`${x},${y}`);

    const getPredictedEnergy = () => {
        let energy = p1.energy;
        p1.actionQueue.forEach(a => {
            if (a.type === 'rest') {
                energy = Math.min(100, energy + 10);
            } else if (a.type === 'play_card' && a.cardInstanceId) {
                const c = p1.hand.find(hc => hc.id === a.cardInstanceId);
                if (c) {
                    const baseId = c.originalId || c.id;
                    if (baseId === 'meditation') energy = Math.min(100, energy + 30);
                    else {
                        const cost = c.cost === 'all_energy' || c.cost === 'all' ? energy : (typeof c.cost === 'number' ? c.cost : 0);
                        energy -= cost;
                    }
                }
            }
        });
        return Math.max(0, energy);
    };

    const handleTileClick = (x: number, y: number) => {
        if (!currentCommand || store.status !== 'planning' || p1.isReady) return;
        if (currentCommand === 'move') {
            const dx = x - virtualPos.x;
            const dy = y - virtualPos.y;
            if ((p1.characterId === 'jumper' && p1.skillLevel >= 1) || Math.abs(dx) + Math.abs(dy) === 1) {
                store.appendAction(myId!, { type: 'move', dx, dy, targetX: x, targetY: y });
            }
        } else if (currentCommand === 'play_card' && targetingCardId && targetingDef?.type !== 'hand') {
            if (!isInRange(x, y)) return;
            store.appendAction(myId!, { type: 'play_card', cardInstanceId: targetingCardId, targetX: x, targetY: y });
            setTargetingCardId(null); setHoveredMapCell(null); setCurrentCommand(null);
        }
    };

    const handleEnemyHandClick = (index: number) => {
        if (store.status !== 'planning' || p1.isReady || currentCommand !== 'play_card' || !targetingCardId) return;
        if (targetingDef?.type === 'hand') {
            store.appendAction(myId!, { type: 'play_card', cardInstanceId: targetingCardId, targetCardIndex: index });
            setTargetingCardId(null); setCurrentCommand(null);
        }
    };

    const handleCommandSelect = (cmd: ActionCommandType) => {
        if (store.status !== 'planning' || p1.isReady) return;
        setCurrentCommand(cmd);
        if (cmd === 'draw' || cmd === 'rest') {
            store.appendAction(myId!, { type: cmd });
            setCurrentCommand(null);
        }
    };

    const handleDPadMove = (dx: number, dy: number) => {
        if (store.status !== 'planning' || p1.isReady) return;
        store.appendAction(myId!, { type: 'move', dx, dy });
    };

    const isPlanning = store.status === 'planning';
    const isResolving = store.status === 'resolving';
    const isDiscarding = store.status === 'discarding' && p1.hand.length > 10;
    const isP1Turn = isPlanning && !p1.isReady && !isResolving;

    const renderActionIcon = (action: Action) => {
        if (!action) return null;
        switch (action.type) {
            case 'move': return <MousePointer2 size={24} color="#E6C36A" />;
            case 'play_card': return <Sword size={24} color="#ff4c4c" />;
            case 'draw': return <BookOpen size={24} color="#4c9aff" />;
            case 'rest': return <Activity size={24} color="#4cff4c" />;
            default: return null;
        }
    };

    const resolvingItems = store.status === 'resolving' ? [0, 1, 2, 3, 4, 5].map(step => {
        const isMe = myResolvingSteps.includes(step);
        const actionIdx = Math.floor(step / 2);
        return {
            owner: isMe ? 'P1' : 'P2',
            action: isMe ? p1.actionQueue[actionIdx] : p2.actionQueue[actionIdx],
            isTarget: store.resolvingStep === step
        };
    }) : [];

    const renderLogLine = (log: string, index: number) => {
        if (!log || !log.trim()) return null;
        if (log.startsWith('---') || log.startsWith('***') || log.includes('무승부') || log.includes('승리')) {
            return (
                <div key={index} style={{ textAlign: 'center', margin: '16px 0 8px 0', padding: '6px', background: 'linear-gradient(90deg, transparent, rgba(230, 195, 106, 0.15), transparent)', color: '#E6C36A', fontWeight: 900, fontSize: '13px', letterSpacing: '2px', textShadow: '0 0 5px rgba(230,195,106,0.5)' }}>
                    {log}
                </div>
            );
        }
        const isP1 = log.includes('player1') || log.includes('P1');
        const isP2 = log.includes('player2') || log.includes('P2');
        const isSubAction = log.trim().startsWith('->') || log.trim().startsWith('>>');
        let borderColor = '#555'; let bgColor = 'rgba(255,255,255,0.02)'; let textColor = '#ddd';

        if (isP1) { borderColor = '#4c9aff'; bgColor = 'rgba(76, 154, 255, 0.08)'; }
        else if (isP2) { borderColor = '#ff4c4c'; bgColor = 'rgba(255, 76, 76, 0.08)'; }

        if (log.includes('피해') || log.includes('데미지') || log.includes('감소') || log.includes('폭발') || log.includes('즉사')) textColor = '#ff8888';
        if (log.includes('회복') || log.includes('치료')) textColor = '#88ff88';
        if (log.includes('상태이상') || log.includes('부여') || log.includes('무기') || log.includes('방어도') || log.includes('스캔') || log.includes('복제')) textColor = '#dca3ff';

        return (
            <motion.div key={index} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }}
                style={{
                    marginLeft: isSubAction ? '20px' : '0', borderLeft: `4px solid ${borderColor}`, background: bgColor,
                    padding: '8px 12px', marginBottom: '6px', borderRadius: '0 6px 6px 0',
                    fontSize: isSubAction ? '12px' : '13px', fontWeight: isSubAction ? 'normal' : 'bold',
                    color: textColor, lineHeight: '1.4', textShadow: '0 1px 2px rgba(0,0,0,0.8)'
                }}>
                {log}
            </motion.div>
        );
    };

    return (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* 💡 화면비 고정 및 해상도 대응용 래퍼 */}
            <div style={{ position: 'relative', width: '100vw', height: '100vh', backgroundImage: 'url("/map_images/background.png")', backgroundSize: 'cover', backgroundPosition: 'center', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: 'inset 0 0 150px rgba(0,0,0,0.9)' }}>
                
                <VFXManager />
                <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: '30%', height: '40%', background: 'radial-gradient(circle, rgba(255,100,0,0.15) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none', zIndex: 1 }} />
                <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '30%', height: '40%', background: 'radial-gradient(circle, rgba(255,100,0,0.15) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none', zIndex: 1 }} />

                <AnimatePresence>
                    {store.peekingCards && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.8 }} 
                            animate={{ opacity: 1, scale: 1 }} 
                            exit={{ opacity: 0, scale: 0.8 }} 
                            style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'auto', cursor: 'pointer' }}
                            onClick={() => store.closePeekingCards()}
                        >
                            <Text size="2xl" fw={900} c="blue.4" mb="xl" style={{ fontFamily: 'var(--font-fantasy)', textShadow: '0 0 15px blue', fontSize: '30px', marginBottom: '80px' }}>상대방의 손패를 확인했습니다!</Text>
                            <div style={{ display: 'flex', gap: '80px' }}>
                                {store.peekingCards.map((c, i) => (
                                    <div key={i} style={{ transform: 'scale(2.5)', margin: '40px' }}>
                                        <GameCard3D card={c} disabled={false} selected={false} />
                                    </div>
                                ))}
                            </div>
                            <Text size="sm" c="gray.5" mt="xl" style={{ marginTop: '120px' }}>(화면을 클릭하면 닫힙니다)</Text>
                        </motion.div>
                    )}
                </AnimatePresence>

                {isDiscarding && (
                    <div style={{ position: 'absolute', inset: 0, zIndex: 25, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'auto' }}>
                        <Text size="xl" fw={800} c="red.4" style={{ fontFamily: 'var(--font-fantasy)', textShadow: '0 0 10px red' }}>손패가 가득 찼습니다. 버릴 카드를 먼저 선택하세요!</Text>
                    </div>
                )}

                {store.status === 'planning' && p1.isReady && !p2.isReady && (
                    <div style={{ position: 'absolute', inset: 0, zIndex: 25, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'auto' }}>
                        <Text size="2xl" fw={800} c="gray.3" style={{ fontFamily: 'var(--font-fantasy)', textShadow: '0 0 10px rgba(255,255,255,0.5)', letterSpacing: '2px', fontSize: '32px' }}>
                            상대방이 전략을 구상 중입니다...
                        </Text>
                    </div>
                )}

                {store.status === 'discarding' && p1.hand.length <= 10 && p2.hand.length > 10 && (
                    <div style={{ position: 'absolute', inset: 0, zIndex: 25, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'auto' }}>
                        <Text size="2xl" fw={800} c="gray.3" style={{ fontFamily: 'var(--font-fantasy)', textShadow: '0 0 10px rgba(255,255,255,0.5)', letterSpacing: '2px', fontSize: '32px' }}>
                            상대방이 카드를 정리 중입니다...
                        </Text>
                    </div>
                )}

                {/* 💡 게임 오버 결과창 및 로비 귀환 */}
                <AnimatePresence>
                    {store.status === 'game_over' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{ position: 'absolute', inset: 0, zIndex: 99999, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'auto', cursor: 'pointer' }}
                            onClick={() => {
                                // 사운드 중단 (lobby 브금으로 변경하거나 다른 화면에서 처리)
                                SoundEngine.playBGM('bgm_lobby');
                                
                                // 서버에 방 퇴장 명시적 알림
                                socket?.emit('LEAVE_ROOM');
                                
                                store.reset();
                                router.push('/');
                            }}
                        >
                            {p1.hp > 0 && p2.hp <= 0 && (
                                <Text fw={900} style={{ fontFamily: 'var(--font-fantasy)', fontSize: '100px', color: '#E6C36A', textShadow: '0 0 40px #E6C36A, 0 10px 20px #000', letterSpacing: '10px' }}>
                                    VICTORY
                                </Text>
                            )}
                            {p1.hp <= 0 && p2.hp > 0 && (
                                <Text fw={900} style={{ fontFamily: 'var(--font-fantasy)', fontSize: '100px', color: '#ff4c4c', textShadow: '0 0 40px #ff4c4c, 0 10px 20px #000', letterSpacing: '10px' }}>
                                    DEFEAT
                                </Text>
                            )}
                            {p1.hp <= 0 && p2.hp <= 0 && (
                                <Text fw={900} style={{ fontFamily: 'var(--font-fantasy)', fontSize: '100px', color: '#aaaaaa', textShadow: '0 0 40px #aaaaaa, 0 10px 20px #000', letterSpacing: '10px' }}>
                                    DRAW
                                </Text>
                            )}
                            <Text size="xl" c="gray.5" mt="xl" style={{ marginTop: '50px' }}>
                                (화면을 클릭하면 로비로 돌아갑니다)
                            </Text>
                        </motion.div>
                    )}
                </AnimatePresence>

                <TurnIndicator turnLabel={turnLabel} />

                {store.status === 'resolving' && (
                    <div style={{ position: 'absolute', top: '16%', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px', zIndex: 50, background: 'rgba(0,0,0,0.6)', padding: '8px 16px', borderRadius: '12px', border: '2px solid #5a4231', boxShadow: '0 4px 15px rgba(0,0,0,0.8)' }}>
                        {resolvingItems.map((item, idx) => (
                            <div key={idx} style={{ width: '44px', height: '44px', borderRadius: '8px', background: item.owner === 'P1' ? 'rgba(76, 154, 255, 0.2)' : 'rgba(255, 76, 76, 0.2)', border: `2px solid ${item.isTarget ? '#E6C36A' : item.owner === 'P1' ? '#4c9aff' : '#ff4c4c'}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: item.isTarget ? 1 : 0.4, transform: item.isTarget ? 'scale(1.15)' : 'scale(1)', transition: 'all 0.3s' }}>
                                <span style={{ fontSize: '10px', color: '#fff', fontWeight: 'bold' }}>{item.owner}</span>
                                <div style={{ transform: 'scale(0.8)' }}>{renderActionIcon(item.action)}</div>
                            </div>
                        ))}
                    </div>
                )}

                <div style={{ position: 'absolute', top: '2%', left: '8%', right: '8%', zIndex: 100, display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: '600px', marginBottom: '20px' }}>
                        <PlayerStatus player={p2} isTurn={store.status === 'planning' && !p2.isReady} reverse prevHp={prevP2Hp} />
                    </div>
                    
                    <div style={{ position: 'relative', width: '100%', height: '140px', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', perspective: '1000px',transform: 'translate(0px, 0px)' }}>
                        <AnimatePresence>
                            {p2.hand.map((card, i) => {
                                const total = p2.hand.length;
                                const centerIdx = (total - 1) / 2;
                                const offset = i - centerIdx;
                                const rotateZ = offset * -6; 
                                const translateX = offset * 50;
                                const translateY = Math.abs(offset) * 8; 
                                const isTargetingHand = targetingDef?.type === 'hand';

                                return (
                                    <motion.div 
                                        key={card.id} 
                                        initial={{ opacity: 0, y: -50 }} 
                                        animate={{ opacity: 1, x: translateX, y: translateY, rotateZ: rotateZ }} 
                                        exit={{ opacity: 0, scale: 0.5, y: -50 }}
                                        onClick={() => handleEnemyHandClick(i)}
                                        style={{ 
                                            position: 'absolute',
                                            width: '90px', height: '130px', 
                                            backgroundImage: 'url("/images/card_back.jpg")', 
                                            backgroundSize: '100% 100%', backgroundPosition: 'center',
                                            borderRadius: '8px', border: '2px solid #4a3b2c',
                                            boxShadow: '0 8px 16px rgba(0,0,0,0.8)',
                                            cursor: isTargetingHand ? 'crosshair' : 'default',
                                            filter: isTargetingHand ? 'drop-shadow(0 0 15px rgba(255, 50, 50, 1)) brightness(1.3)' : 'none',
                                            transformOrigin: 'top center',
                                            zIndex: 50 + i
                                        }}
                                        whileHover={isTargetingHand ? { scale: 1.15, y: translateY + 15, zIndex: 100 } : {}}
                                    />
                                );
                            })}
                        </AnimatePresence>
                    </div>
                </div>

                <div style={{ position: 'absolute', top: '35%', left: '8%', zIndex: 39, display: 'flex', flexDirection: 'column', alignItems: 'center', pointerEvents: 'none', transform: 'translate(-10px, 10px)' }}>
                    <Text fw={700} size="sm" c="gray.4" mb={4} style={{ textShadow: '0 2px 4px #000' }}>버린 패: {p1.discardPile.length}</Text>
                    <img src="/map_images/deck_icon.png" alt="Discard Pile" style={{ width: '110px', height: '154px', borderRadius: '8px', border: '1px solid #666', opacity: 0.8, filter: 'grayscale(50%)' }} />
                </div>
                <div style={{ position: 'absolute', top: '35%', right: '8%', zIndex: 39, display: 'flex', flexDirection: 'column', alignItems: 'center', pointerEvents: 'none', transform: 'translate(10px, 10px)' }}>
                    <Text fw={700} size="sm" c="gray.4" mb={4} style={{ textShadow: '0 2px 4px #000' }}>버린 패: {p2.discardPile.length}</Text>
                    <img src="/map_images/deck_icon.png" alt="Discard Pile" style={{ width: '110px', height: '154px', borderRadius: '8px', border: '1px solid #666', opacity: 0.8, filter: 'grayscale(50%)' }} />
                </div>

                {store.lastPlayedCard?.player1 && (
                    <div style={{ position: 'absolute', top: '35%', left: '8%', zIndex: 40, transform: 'scale(0.85)', animation: 'fade-in 0.5s', pointerEvents: 'none' }}>
                        <Text fw={900} size="xl" c="blue.4" mb="sm" ta="center" style={{ fontFamily: 'var(--font-fantasy)', textShadow: '0 2px 4px #000' }}>P1 발동!</Text>
                        <GameCard3D card={store.lastPlayedCard.player1} disabled={false} selected={false} />
                    </div>
                )}
                {store.lastPlayedCard?.player2 && (
                    <div style={{ position: 'absolute', top: '35%', right: '8%', zIndex: 40, transform: 'scale(0.85)', animation: 'fade-in 0.5s', pointerEvents: 'none' }}>
                        <Text fw={900} size="xl" c="red.4" mb="sm" ta="center" style={{ fontFamily: 'var(--font-fantasy)', textShadow: '0 2px 4px #000' }}>P2 발동!</Text>
                        <GameCard3D card={store.lastPlayedCard.player2} disabled={false} selected={false} />
                    </div>
                )}

                <div style={{ position: 'absolute', top: '2%', left: '2%', width: '420px', height: '320px', display: 'flex', flexDirection: 'column', background: 'linear-gradient(180deg, rgba(20, 15, 10, 0.95) 0%, rgba(10, 10, 15, 0.85) 100%)', border: '2px solid #5a4231', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.8), inset 0 0 20px rgba(0,0,0,0.5)', zIndex: 20, overflow: 'hidden' }}>
                    <div style={{ background: 'linear-gradient(90deg, #3a2a1c, #5a4231, #3a2a1c)', padding: '10px', textAlign: 'center', borderBottom: '2px solid #2a1a0c', boxShadow: '0 4px 6px rgba(0,0,0,0.5)', zIndex: 2 }}>
                        <Text fw={900} size="md" c="#E6C36A" style={{ fontFamily: 'var(--font-fantasy)', letterSpacing: '2px', textShadow: '0 2px 4px #000' }}>⚔️ BATTLE CHRONICLE ⚔️</Text>
                    </div>
                    <ScrollArea style={{ flex: 1 }} p="sm" scrollbarSize={6} offsetScrollbars>
                        <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: '10px' }}>
                            {store.logs.map((log, i) => renderLogLine(log, i))}
                            <div ref={logEndRef} />
                        </div>
                    </ScrollArea>
                </div>

                <div style={{ position: 'absolute', bottom: '6%', left: '2%', zIndex: 35, display: 'flex', flexDirection: 'column', alignItems: 'center', pointerEvents: 'none' }}>
                    <Text fw={700} size="sm" c="white" mb={4} style={{ textShadow: '0 2px 4px #000' }}>덱: {p1.drawPile.length}</Text>
                    <motion.img src="/map_images/deck_icon.png" animate={{ rotateY: p1.shuffleCount * 360 }} transition={{ duration: 0.5 }} style={{ width: '110px', height: '154px', borderRadius: '8px', border: '3px solid #E6C36A', boxShadow: '0 8px 16px rgba(0,0,0,0.9)' }} />
                </div>
                <div style={{ position: 'absolute', top: '10%', right: '28%',left: '90%', zIndex: 35, display: 'flex', flexDirection: 'column', alignItems: 'center', pointerEvents: 'none' }}>
                    <Text fw={700} size="sm" c="white" mb={4} style={{ textShadow: '0 2px 4px #000' }}>덱: {p2.drawPile.length}</Text>
                    <motion.img src="/map_images/deck_icon.png" animate={{ rotateY: p2.shuffleCount * 360 }} transition={{ duration: 0.5 }} style={{ width: '110px', height: '154px', borderRadius: '8px', border: '3px solid #E6C36A', boxShadow: '0 8px 16px rgba(0,0,0,0.9)' }} />
                </div>

                <div style={{ position: 'absolute', top: '28%', height: '50%', left: '8%', right: '8%', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', zIndex: 10 }}>
                    <motion.div style={{ pointerEvents: 'auto' }} animate={store.isScreenShaking ? { x: [-10, 10, -10, 10, -5, 5, 0], y: [-5, 5, -5, 5, 0] } : { x: 0, y: 0 }} transition={{ duration: 0.4 }}>
                        <FieldBoard p1Pos={p1.position} p2Pos={p2.position} virtualP1Pos={virtualPos} previewTiles={previewTiles} validTargets={validTargets} targetTiles={new Set(currentCommand === 'play_card' ? [targetingCardId || ''] : [])} onTileClick={handleTileClick} onTileHover={(x, y) => setHoveredMapCell({ x, y })} onTileLeave={() => setHoveredMapCell(null)} isTargeting={currentCommand === 'play_card' && !!targetingCardId && targetingDef?.type !== 'hand'} visualEffects={store.visualEffects} isP1Turn={store.status === 'resolving' && myResolvingSteps.includes(store.resolvingStep)} isP2Turn={store.status === 'resolving' && enemyResolvingSteps.includes(store.resolvingStep)} p1ResolvingSteps={myResolvingSteps} p2ResolvingSteps={enemyResolvingSteps} p1Statuses={p1.statuses} p2Statuses={p2.statuses} removeVisualEffect={store.removeVisualEffect} p1CharId={p1.characterId} p2CharId={p2.characterId} p1Hp={p1.hp} p2Hp={p2.hp} resolvingStep={store.resolvingStep} p1Action={p1.actionQueue} p2Action={p2.actionQueue} status={store.status} />
                    </motion.div>
                </div>

                <div style={{ position: 'absolute', top: '65%', height: '35%', left: '8%', right: '8%', zIndex: 30, display: 'flex', pointerEvents: 'none' }}>
                    <div style={{ width: '350px', height: '100%', position: 'relative', zIndex: 35, pointerEvents: 'auto' }}>
                        <div style={{ position: 'absolute', top: '20%', width: '100%' }}>
                            <PlayerStatus player={p1} isTurn={isP1Turn} prevHp={prevP1Hp} />
                        </div>
                    </div>

                    <div style={{ position: 'absolute', bottom: '8%', left: '0', right: '0', height: 'auto', zIndex: 30, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', pointerEvents: 'none' }}>
                        <div style={{ flex: 1, position: 'relative', height: '100%', minHeight: '280px', marginLeft: '450px' }}>
                            <div style={{ pointerEvents: 'none', width: '100%', height: '100%', position: 'absolute', bottom: 0, background: 'linear-gradient(to top, rgba(10,10,15,0.8) 0%, rgba(10,10,15,0) 100%)' }}>
                                <HandSystem 
                                    hand={p1.hand} 
                                    selectedCardId={targetingCardId} 
                                    currentEnergy={getPredictedEnergy()} 
                                    usedEnergy={0} 
                                    disabled={!isP1Turn && !isDiscarding} 
                                    isDiscarding={isDiscarding}
                                    jumperDamageStack={p1.jumperDamageStack} 
                                    queuedCardIds={p1.actionQueue.map(a => a?.cardInstanceId).filter(Boolean) as string[]} 
                                    onSelectCard={(cardId) => {
                                        if (p1.actionQueue.some(a => a?.cardInstanceId === cardId)) return;
                                        if (isDiscarding) { 
                                            socket?.emit('CARD_DISCARD', { cardInstanceId: cardId });
                                            store.discardHandCard(myId!, cardId); 
                                            return; 
                                        }
                                        const card = p1.hand.find(c => c.id === cardId);
                                        
                                        if (card && (card.originalId === 'blink' || card.id === 'blink')) return;

                                        if (card && (card.targeting.type === 'none')) {
                                            if (store.status === 'planning' && !p1.isReady) store.appendAction(myId!, { type: 'play_card', cardInstanceId: cardId });
                                            return;
                                        }

                                        if (currentCommand !== 'play_card') setCurrentCommand('play_card');
                                        if (targetingCardId === cardId) { setTargetingCardId(null); setHoveredMapCell(null); }
                                        else { setTargetingCardId(cardId); setHoveredMapCell(null); }
                                    }} 
                                />
                            </div>
                        </div>

                        <div style={{ width: '320px', height: 'auto', zIndex: 40, pointerEvents: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px', background: 'url("https://www.transparenttextures.com/patterns/black-scales.png"), #2a2015', backgroundBlendMode: 'multiply', border: '4px solid #5a4231', borderRadius: '12px', marginRight: '2%', boxShadow: '0 10px 40px rgba(0,0,0,0.8), inset 0 0 30px rgba(0,0,0,0.9)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '6px', zIndex: 10 }}>
                                {p1.actionQueue.map((action, idx) => {
                                    const isTargetStep = store.status === 'resolving' && store.resolvingStep === idx * 2;
                                    return (
                                        <div key={idx} onClick={() => { if (isP1Turn && action.type !== 'none') store.unstageAction(myId!, idx); }} style={{ flex: 1, aspectRatio: '1', maxHeight: '64px', background: 'rgba(20, 15, 10, 0.8)', border: `2px solid ${isTargetStep ? '#E6C36A' : action.type !== 'none' ? '#5a4231' : '#33241a'}`, borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: (isP1Turn && action.type !== 'none') ? 'pointer' : 'default', boxShadow: isTargetStep ? '0 0 15px rgba(230, 195, 106, 0.5)' : 'none', transition: 'all 0.2s', position: 'relative' }}>
                                            {renderActionIcon(action)}
                                            {action.type === 'none' && <Text size="xs" c="gray.6" mt={4}>Empty</Text>}
                                            {isP1Turn && action.type !== 'none' && (
                                                <div style={{ position: 'absolute', top: -5, right: -5, background: '#ff4c4c', borderRadius: '50%', padding: '2px' }}><X size={10} color="#fff" /></div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            <Group align="center" justify="center" gap="xs" mt="auto" style={{ background: 'rgba(0,0,0,0.4)', padding: '8px', borderRadius: '8px', border: '1px solid #4a3b2c', overflow: 'visible' }}>
                                <div style={{ transform: 'scale(0.85)', transformOrigin: 'center' }}>
                                    {p1.characterId === 'jumper' && p1.skillLevel >= 1 ? (
                                        <div style={{ textAlign: 'center', padding: '10px', background: 'rgba(155, 89, 182, 0.2)', border: '1px solid #9b59b6', borderRadius: '8px' }}>
                                            <Text size="sm" fw={800} c="violet.3">🔮 블링크 대기 중</Text>
                                            <Text size="xs" c="gray.5">맵 아무 곳이나 클릭하세요</Text>
                                        </div>
                                    ) : targetingDef?.type === 'hand' ? (
                                        <div style={{ textAlign: 'center', padding: '10px', background: 'rgba(200, 50, 50, 0.2)', border: '1px solid #ff4c4c', borderRadius: '8px' }}>
                                            <Text size="sm" fw={800} c="red.4">상대의 손패를 클릭하세요!</Text>
                                        </div>
                                    ) : (
                                        <ActionDPad onMove={handleDPadMove} disabled={!isP1Turn} />
                                    )}
                                </div>
                                <div style={{ transform: 'scale(0.85)', transformOrigin: 'center' }}>
                                    <ActionPanel currentCommand={currentCommand} onCommandSelect={handleCommandSelect} disabled={!isP1Turn} />
                                </div>
                            </Group>

                            <div style={{ marginTop: 'auto', width: '100%', height: '50px', position: 'relative', flexShrink: 0 }}>
                                {isP1Turn && p1.actionQueue.every(a => a && a.type !== 'none') ? (
                                    <button onClick={() => { store.setReady(myId!); socket?.emit('ACTION_SUBMIT', p1.actionQueue); }} style={{ width: '100%', height: '100%', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, backgroundImage: 'url("/map_images/btn_turn_idle.png")', backgroundSize: '100% 100%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', transition: 'background-image 0.2s ease, transform 0.1s ease' }} onMouseEnter={(e) => { if (store.status === 'planning' || store.status === 'resolving') return; e.currentTarget.style.backgroundImage = 'url("/map_images/btn_turn_hover.png")'; }} onMouseLeave={(e) => { if (store.status === 'planning' || store.status === 'resolving') return; e.currentTarget.style.backgroundImage = 'url("/map_images/btn_turn_idle.png")'; }} onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'} onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'} />
                                ) : (
                                    <button disabled style={{ width: '100%', height: '100%', background: 'transparent', border: 'none', padding: 0, backgroundImage: 'url("/map_images/btn_turn_idle.png")', backgroundSize: '100% 100%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', opacity: 0.5, filter: 'grayscale(100%)', cursor: 'not-allowed' }} />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}