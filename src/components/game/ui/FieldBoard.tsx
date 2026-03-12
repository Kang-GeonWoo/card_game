"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { VisualEffect, PlayerStatus, Action } from '../../../types';

interface FieldBoardProps {
    p1Pos: { x: number; y: number };
    p2Pos: { x: number; y: number };
    previewTiles: Set<string>;
    validTargets?: Set<string>;
    targetTiles?: Set<string>;
    onTileClick: (x: number, y: number) => void;
    onTileHover: (x: number, y: number) => void;
    onTileLeave: () => void;
    isTargeting: boolean;
    virtualP1Pos?: { x: number; y: number };
    visualEffects?: VisualEffect[];
    isP1Turn?: boolean;
    isP2Turn?: boolean;
    p1Statuses?: PlayerStatus[];
    p2Statuses?: PlayerStatus[];
    removeVisualEffect?: (id: string) => void;
    p1CharId?: string;
    p2CharId?: string;
    p1Hp?: number;
    p2Hp?: number;
    resolvingStep?: number;
    p1Action?: Action[];
    p2Action?: Action[];
    status?: string;
    p1ResolvingSteps?: number[];
    p2ResolvingSteps?: number[];
    // 💡 1턴 한정 '나' 표시를 위한 현재 턴 카운트
    turnCount?: number;
}

export function FieldBoard({
    p1Pos, p2Pos, virtualP1Pos, previewTiles, validTargets, targetTiles,
    onTileClick, onTileHover, onTileLeave, isTargeting,
    visualEffects = [], isP1Turn = false, isP2Turn = false,
    p1Statuses = [], p2Statuses = [], removeVisualEffect = () => { },
    p1CharId = 'warrior', p2CharId = 'warrior', p1Hp, p2Hp, resolvingStep, p1Action, p2Action, status,
    p1ResolvingSteps = [0, 2, 4], p2ResolvingSteps = [1, 3, 5],
    turnCount = 0  // 💡 1턴일 때만 '나' 표시 (0이면 보이지 않음)
}: FieldBoardProps) {
    const GRID_SIZE = 3;

    const getAnimationState = (isPlayer1: boolean) => {
        const hp = isPlayer1 ? p1Hp : p2Hp;
        const pos = isPlayer1 ? p1Pos : p2Pos;
        if (hp !== undefined && hp <= 0) return 'death_down';
        const isGettingHit = visualEffects.some(ef => ef.x === pos.x && ef.y === pos.y && (ef.type === 'slash' || ef.type === 'explosion' || ef.type === 'magic'));
        if (isGettingHit) return 'hit';
        if (status === 'resolving' && resolvingStep !== undefined) {
            const isMyTurn = isPlayer1 ? p1ResolvingSteps.includes(resolvingStep) : p2ResolvingSteps.includes(resolvingStep);
            if (isMyTurn) {
                const actionIndex = Math.floor(resolvingStep / 2);
                const currentActionArr = isPlayer1 ? p1Action : p2Action;
                const currentAction = currentActionArr ? currentActionArr[actionIndex] : null;
                if (currentAction && currentAction.type === 'move') return 'walk';
                if (currentAction && currentAction.type === 'play_card') return 'skill_cast_loop';
            }
        }
        return 'idle';
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${GRID_SIZE}, 150px)`, gridTemplateRows: `repeat(${GRID_SIZE}, 150px)`, gap: '4px', padding: '24px', background: 'rgba(20, 20, 30, 0.4)', borderRadius: '12px', border: '2px solid rgba(255, 215, 0, 0.2)', boxShadow: '0 8px 32px rgba(0,0,0,0.8)', margin: 'auto' }}>
            {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
                const x = i % GRID_SIZE; const y = Math.floor(i / GRID_SIZE);
                const isP1 = p1Pos.x === x && p1Pos.y === y;
                const isP2 = p2Pos.x === x && p2Pos.y === y;
                const isVirtualP1 = virtualP1Pos && virtualP1Pos.x === x && virtualP1Pos.y === y && !isP1;
                const isPreview = previewTiles.has(`${x},${y}`);
                const isTarget = targetTiles?.has(`${x},${y}`);
                const isValidTarget = validTargets ? validTargets.has(`${x},${y}`) : true;
                const isOutOfRange = isTargeting && !isValidTarget;
                const tileEffects = visualEffects.filter(ef => ef.x === x && ef.y === y);

                return (
                    <motion.div key={`${x}-${y}`} whileHover={{ scale: 1.05, z: 15 }} onClick={() => onTileClick(x, y)} onMouseEnter={() => onTileHover(x, y)} onMouseLeave={onTileLeave} style={{ width: '150px', height: '150px', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: isTargeting ? (isOutOfRange ? 'not-allowed' : 'crosshair') : 'default', position: 'relative', overflow: 'visible' }}>
                        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url("/map_images/${isTarget ? 'tile_red' : isPreview ? 'tile_blue' : 'tile_normal'}.png")`, backgroundSize: '100% 100%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', transform: 'scale(1.514) rotate(45deg)', filter: isOutOfRange ? 'brightness(0.5)' : 'brightness(0.9)', transition: 'background-image 0.2s ease, filter 0.2s ease', animation: isTarget ? 'pulse-red 1.5s infinite' : 'none', pointerEvents: 'none', zIndex: 0 }} />
                        
                        {(isTarget || isPreview) && (
                            <img src="/effect_images/Crosshair.png" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', mixBlendMode: 'screen', backgroundColor: 'transparent', pointerEvents: 'none', zIndex: 25, opacity: isTarget ? 1 : 0.6, objectFit: 'cover' }} />
                        )}


                        {/* 💡 1턴 한정 '나▼' 표시 + 황금 테두리 없이 스프라이트만 대력 렌더링 */}
                        {isP1 && (
                            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', zIndex: 6 }}>
                                {/* 💡 1턴 계획 단계(status=planning, turnCount=1)에서만 '나 ▼' 표시 */}
                                {status === 'planning' && turnCount === 1 && (
                                    <motion.div
                                        initial={{ y: 0, opacity: 0 }}
                                        animate={{ y: -65, opacity: 1 }}
                                        transition={{ duration: 0.4, ease: 'easeOut' }}
                                        style={{
                                            position: 'absolute',
                                            backgroundColor: '#E6C36A',
                                            color: '#000',
                                            padding: '2px 10px',
                                            borderRadius: '6px',
                                            fontWeight: 900,
                                            fontSize: '16px',
                                            border: '2px solid #fff',
                                            boxShadow: '0 0 15px gold',
                                            zIndex: 100,
                                            whiteSpace: 'nowrap',
                                            pointerEvents: 'none',
                                        }}
                                    >
                                        나 ▼
                                    </motion.div>
                                )}
                                {/* 🔴 황금 테두리 div 제거 - 스프라이트만 렌더링 */}
                                <CharacterSprite charId={p1CharId} animation={getAnimationState(true)} />
                            </div>
                        )}
                        {isVirtualP1 && <CharacterSprite charId={p1CharId} animation="idle" ghostMode />}
                        {/* 상대방(P2) 붉은 테두리 */}
                        {isP2 && (
                            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 6 }}>
                                <div style={{
                                    position: 'absolute',
                                    inset: '-10px',
                                    border: '2px solid rgba(255,80,80,0.7)',
                                    borderRadius: '50%',
                                    boxShadow: '0 0 10px rgba(255,80,80,0.4)',
                                    pointerEvents: 'none',
                                    zIndex: 1,
                                }} />
                                <CharacterSprite charId={p2CharId} animation={getAnimationState(false)} glowColor="rgba(255, 120, 120, 0.7)" />
                            </div>
                        )}

                        <div style={{ position: 'absolute', bottom: 4, right: 6, fontSize: '10px', color: '#555', zIndex: 70 }}>{x},{y}</div>

                        <AnimatePresence>
                            {tileEffects.map(ef => (
                                <TileOneShotEffect key={ef.id} type={ef.type} x={x} y={y} sourceX={ef.sourceX} sourceY={ef.sourceY} onComplete={() => removeVisualEffect(ef.id)} />
                            ))}
                        </AnimatePresence>
                    </motion.div>
                );
            })}
        </div>
    );
}

interface SpriteFrame { x: number; y: number; w: number; h: number; }
function CharacterSprite({ charId, animation = 'idle', glowColor, ghostMode = false }: { charId: string; animation?: string; glowColor?: string; ghostMode?: boolean; }) {
    const [frames, setFrames] = useState<SpriteFrame[]>([]);
    const [currentFrame, setCurrentFrame] = useState(0);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        setFrames([]); setCurrentFrame(0); setVisible(true);
        fetch(`/chracter_images/${charId}.json`).then(res => { if (!res.ok) throw new Error('not found'); return res.json(); })
            .then(data => {
                const animData = data[animation];
                if (animData?.frames?.length) setFrames(animData.frames);
                else {
                    const idleFrames = data['idle']?.frames;
                    if (idleFrames?.length) setFrames(idleFrames); else setVisible(false);
                }
            }).catch(err => setVisible(false));
    }, [charId, animation]);

    useEffect(() => {
        if (frames.length <= 1) return;
        const interval = setInterval(() => setCurrentFrame(prev => (prev + 1) % frames.length), 250);
        return () => clearInterval(interval);
    }, [frames]);

    if (!visible || frames.length === 0) return null;
    const frame = frames[currentFrame];
    const bgPosX = -frame.x; const bgPosY = -frame.y;
    const renderHeight = 121; 
    const renderWidth = Math.round(renderHeight * (frame.w / frame.h));
    const scale = renderHeight / frame.h;

    const filterStr = ghostMode ? 'grayscale(100%) drop-shadow(0 0 6px rgba(255,255,255,0.2)) contrast(1.2)' : glowColor ? `drop-shadow(0 0 10px ${glowColor}) contrast(1.2)` : 'contrast(1.2)';

    return (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ width: `${renderWidth}px`, height: `${renderHeight}px`, backgroundImage: `url("/chracter_images/${charId}.png")`, backgroundPosition: `${bgPosX * scale}px ${bgPosY * scale}px`, backgroundSize: `${1000 * scale}px auto`, backgroundRepeat: 'no-repeat', pointerEvents: 'none', filter: filterStr, opacity: ghostMode ? 0.5 : 1, zIndex: 5, flexShrink: 0, marginTop: '10px' }} />
    );
}

function TileOneShotEffect({ type, x, y, sourceX, sourceY, onComplete }: { type: string; x: number, y: number, sourceX?: number, sourceY?: number, onComplete: () => void }) {
    const [imgError, setImgError] = useState(false);
    let src = ''; let animConfig: any = {}; let initialConfig: any = { opacity: 0, scale: 0.5 }; let duration = 0.5; let extraStyle: React.CSSProperties = {};

    switch (type) {
        case 'projectile':
            src = '/effect_images/projectile.png';
            const dx = sourceX !== undefined ? (sourceX - x) * 154 : 0;
            const dy = sourceY !== undefined ? (sourceY - y) * 154 : 0;
            initialConfig = { x: dx, y: dy, opacity: 1, scale: 0.5 };
            animConfig = { x: 0, y: 0, opacity: 0, scale: 1.2 };
            duration = 0.3;
            extraStyle = { zIndex: 80, mixBlendMode: 'screen' };
            break;
        case 'slash':
            src = '/effect_images/vfx_slash.png';
            initialConfig = { opacity: 0, scale: 0.5, rotate: -30 };
            animConfig = { scale: [0.5, 1.4, 1.8], opacity: [1, 1, 0], rotate: [15, 25] };
            duration = 0.3; break;
        case 'explosion': case 'magic':
            src = '/effect_images/vfx_explosion.png';
            initialConfig = { opacity: 0, scale: 0.2 };
            animConfig = { scale: [0.2, 1.6, 2.2], opacity: [1, 1, 0] };
            duration = 0.6; break;
        case 'heal': case 'buff': case 'shield':
            src = '/effect_images/vfx_heal.png';
            initialConfig = { opacity: 0, scale: 0.8, y: 20 };
            animConfig = { y: [20, -60], opacity: [0, 1, 1, 0], scale: [0.8, 1.1, 1.2] };
            duration = 0.8; break;
        case 'crack':
            src = '/effect_images/crack_effect.png';
            initialConfig = { opacity: 1, scale: 1 };
            animConfig = { opacity: [1, 1, 0], scale: [1, 1.2, 1.4] };
            duration = 0.4; break;
        case 'impact_ring': case 'hit':
            src = '/effect_images/impact_ring.png';
            initialConfig = { opacity: 1, scale: 0 };
            animConfig = { scale: [0, 2.8], opacity: [1, 0] };
            duration = 0.5; extraStyle = { width: '160px', height: '160px' }; break;
        default:
            src = '/effect_images/vfx_slash.png'; animConfig = { opacity: [1, 0] }; break;
    }

    useEffect(() => {
        if (imgError) {
            const timer = setTimeout(() => onComplete(), duration * 1000);
            return () => clearTimeout(timer);
        }
    }, [imgError]);

    if (imgError) return <div style={{ display: 'none' }} />;

    return (
        <motion.img src={src} initial={initialConfig} animate={animConfig} exit={{ opacity: 0 }} transition={{ duration, ease: 'easeOut' }} onAnimationComplete={onComplete} onError={() => setImgError(true)} style={{ position: 'absolute', inset: 0, margin: 'auto', width: '120px', height: '120px', objectFit: 'contain', backgroundColor: 'transparent', pointerEvents: 'none', zIndex: 60, ...extraStyle }} />
    );
}