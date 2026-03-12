"use client";

import { useState, useEffect, useRef } from 'react';
import { Title, Badge, Text, Tooltip, Group } from '@mantine/core';
import { Shield as ShieldIcon } from 'lucide-react'; 
import type { PlayerState } from '../../../types';
import { getStatusData, getSkillData } from '../../../engine/dataLoader';

interface PlayerStatusProps {
    player: PlayerState;
    isTurn: boolean;
    reverse?: boolean; 
    prevHp?: number;
}

export function PlayerStatus({ player, isTurn, reverse = false, prevHp }: PlayerStatusProps) {
    const [dmgText, setDmgText] = useState<number | null>(null);
    const [showFlash, setShowFlash] = useState(false);
    const [showDiscardViewer, setShowDiscardViewer] = useState(false);
    const prevHpRef = useRef(player.hp);

    useEffect(() => {
        // 💡 최대 체력이 아닌 직전 체력(prevHpRef.current)과 비교하여 정확한 피격 데미지 산출
        if (prevHpRef.current > player.hp) {
            const dmg = prevHpRef.current - player.hp;
            setDmgText(dmg);
            setShowFlash(true);
            setTimeout(() => setDmgText(null), 1000);
            setTimeout(() => setShowFlash(false), 300);
        }
        prevHpRef.current = player.hp;
    }, [player.hp]);

    return (
        <div style={{
            position: 'relative', display: 'flex', flexDirection: reverse ? 'row-reverse' : 'row',
            alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px',
            background: 'url("/map_images/frame_top.png")', backgroundSize: '100% 100%',
            backgroundPosition: 'center', backgroundRepeat: 'no-repeat', border: 'none',
            borderRadius: '12px', transition: 'filter 0.3s ease',
            filter: isTurn ? 'drop-shadow(0 0 10px var(--accent-gold))' : 'none'
        }}>
            {showFlash && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(255, 76, 76, 0.3)', borderRadius: reverse ? '0 0 24px 24px' : '24px 24px 0 0', pointerEvents: 'none', zIndex: 10, animation: 'red-flash 0.3s ease-out forwards' }} />
            )}

            {dmgText !== null && (
                <div style={{ position: 'absolute', top: reverse ? '60%' : '-40px', left: reverse ? '10%' : '80%', fontSize: '48px', fontWeight: 900, color: '#ff4c4c', textShadow: '0 0 15px #ff0000, 0 4px 8px #000', animation: 'dmg-pop 1s cubic-bezier(0.1, 0.8, 0.2, 1) forwards', pointerEvents: 'none', zIndex: 20 }}>-{dmgText}</div>
            )}

            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flex: 1 }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                    <div style={{ width: '100px', height: '100px', borderRadius: '50%', border: `6px solid #4a3b2c`, boxShadow: `0 8px 16px rgba(0,0,0,0.7), inset 0 4px 8px rgba(0,0,0,0.9)${isTurn ? ', 0 0 25px rgba(138, 108, 66, 0.8)' : ''}`, background: 'linear-gradient(180deg, #333, #111)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ShieldIcon size={48} color={isTurn ? 'var(--accent-gold)' : '#888'} style={{ filter: 'drop-shadow(0 2px 4px #000)' }} />
                    </div>
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '2px solid rgba(90, 66, 49, 0.3)', paddingBottom: '4px', flexWrap: 'wrap' }}>
                        <Title order={2} style={{ fontFamily: 'var(--font-fantasy)', letterSpacing: '1px', color: 'var(--text-main)', textShadow: '0 1px 2px rgba(255,255,255,0.2)' }}>
                            {player.id.toUpperCase()}
                        </Title>

                        <Tooltip label={`[${getSkillData(player.characterId)?.skill_name}] Lv.${player.skillLevel} 활성화!`} position="top" withArrow>
                            <Badge color={player.skillLevel > 0 ? 'red' : 'gray'} variant="filled" size="lg" style={{ cursor: 'help', boxShadow: player.skillLevel > 0 ? '0 0 10px rgba(255,0,0,0.5)' : 'none', border: player.skillLevel > 0 ? '1px solid #ffcc00' : 'none' }}>
                                특수능력 Lv.{player.skillLevel}
                            </Badge>
                        </Tooltip>

                        {player.statuses && player.statuses.length > 0 && (
                            <Group gap={6} ml="auto">
                                {player.statuses.map((st, i) => {
                                    const sData = getStatusData(st.id);
                                    let borderColor = '#9b59b6'; let bgColor = 'rgba(155, 89, 182, 0.4)'; let labelText = st.id.substring(0, 2).toUpperCase();
                                    if (st.id === 'poison') { borderColor = '#2ecc71'; bgColor = 'rgba(46, 204, 113, 0.4)'; labelText = '독'; }
                                    else if (st.id === 'burn') { borderColor = '#e74c3c'; bgColor = 'rgba(231, 76, 60, 0.4)'; labelText = '화상'; }
                                    else if (st.id === 'freeze') { borderColor = '#3498db'; bgColor = 'rgba(52, 152, 219, 0.4)'; labelText = '빙결'; }
                                    return (
                                        <Tooltip key={i} label={`${sData?.name || st.id} (${st.value}스택)`} position="top">
                                            <div style={{ position: 'relative', width: '28px', height: '28px', border: `2px solid ${borderColor}`, backgroundColor: bgColor, borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.5)', cursor: 'help' }}>
                                                <Text size="10px" fw={900} c="#fff" style={{ textShadow: '0 1px 2px #000' }}>{labelText}</Text>
                                                <div style={{ position: 'absolute', bottom: '-6px', right: '-6px', background: '#111', border: `1px solid ${borderColor}`, borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 'bold', color: '#fff' }}>{st.value}</div>
                                            </div>
                                        </Tooltip>
                                    );
                                })}
                            </Group>
                        )}
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <div style={{ position: 'relative', width: '80px', height: '24px', background: 'url("/map_images/deck_icon.png") no-repeat center', backgroundSize: 'contain', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Text size="xs" fw={800} c="#cbbca0" style={{ textShadow: '0 1px 2px #000', pointerEvents: 'none' }}>{player.drawPile.length}</Text>
                            </div>
                            <div onMouseEnter={() => setShowDiscardViewer(true)} onMouseLeave={() => setShowDiscardViewer(false)} style={{ position: 'relative', width: '80px', height: '24px', background: 'url("/map_images/grave_icon.png") no-repeat center', backgroundSize: 'contain', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'help' }}>
                                <Text size="xs" fw={800} c="#ff6b6b" style={{ textShadow: '0 1px 2px #000', pointerEvents: 'none' }}>{player.discardPile.length}</Text>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {player.shield > 0 && (
                            <Badge color="blue" size="lg" variant="filled" leftSection={<ShieldIcon size={14} />} style={{ alignSelf: 'flex-start', boxShadow: '0 0 10px rgba(50, 150, 255, 0.8)', border: '1px solid #fff' }}>
                                방어력: {player.shield}
                            </Badge>
                        )}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative', height: '20px' }}>
                            <Text fw={900} size="sm" c="#d5c7a3" style={{ minWidth: '30px', fontFamily: 'var(--font-fantasy)', textShadow: '0 1px 2px #000', zIndex: 2 }}>HP</Text>
                            <div style={{ flex: 1, position: 'relative', height: '100%', background: 'rgba(0,0,0,0.5)', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${Math.max(0, player.hp)}%`, backgroundImage: 'url("/map_images/hp_fill.png")', backgroundSize: '100% 100%', transition: 'width 0.4s ease-out' }} />
                                <Text style={{ position: 'absolute', inset: 0, textAlign: 'center', color: '#fff', fontSize: '12px', fontWeight: 900, textShadow: '0 1px 2px #000', lineHeight: '20px' }}>{Math.max(0, player.hp)} / 100</Text>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative', height: '20px' }}>
                            <Text fw={900} size="sm" c="#d5c7a3" style={{ minWidth: '30px', fontFamily: 'var(--font-fantasy)', textShadow: '0 1px 2px #000', zIndex: 2 }}>EP</Text>
                            <div style={{ flex: 1, position: 'relative', height: '100%', background: 'rgba(0,0,0,0.5)', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${Math.max(0, player.energy)}%`, backgroundImage: 'url("/map_images/ep_fill.png")', backgroundSize: '100% 100%', transition: 'width 0.4s ease-out' }} />
                                <Text style={{ position: 'absolute', inset: 0, textAlign: 'center', color: '#fff', fontSize: '12px', fontWeight: 900, textShadow: '0 1px 2px #000', lineHeight: '20px' }}>{Math.max(0, player.energy)} / 100</Text>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}