"use client";

import { motion } from 'framer-motion';
import { useState } from 'react';
import type { Card } from '../../../types';
import { Tooltip } from '@mantine/core';

const CARD_COLORS: Record<string, { bg: string; border: string; accent: string }> = {
    attack: { bg: 'linear-gradient(145deg,#2c1010,#4a1a1a)', border: '#e53e3e', accent: '#fc8181' },
    magic: { bg: 'linear-gradient(145deg,#12103a,#1e1870)', border: '#7c3aed', accent: '#c4b5fd' },
    support: { bg: 'linear-gradient(145deg,#0c2a1e,#133d2e)', border: '#2f855a', accent: '#68d391' },
    defense: { bg: 'linear-gradient(145deg,#1a1a2e,#2a2a4a)', border: '#3182ce', accent: '#90cdf4' },
    default: { bg: 'linear-gradient(145deg,#1a1a1a,#2d2d2d)', border: '#4a5568', accent: '#a0aec0' },
};

const imgUrl = (name: string | undefined) => name ? `/images/${name.replace(/\.png$/i, '.jpg')}` : undefined;

interface GameCardProps {
    card: Card;
    disabled: boolean;
    selected?: boolean;
    onClick?: () => void;
    style?: React.CSSProperties;
    initial?: any; animate?: any; transition?: any; whileHover?: any; whileTap?: any;
    drag?: boolean; onDragStart?: () => void; onDragEnd?: (e: any, info: any) => void;
    errorShake?: boolean; exit?: any;
    jumperDamageStack?: number;
    isQueued?: boolean;
}

export function GameCard3D({
    card, disabled, selected, onClick,
    style, initial, animate, transition, whileHover, whileTap,
    drag, onDragStart, onDragEnd, errorShake, exit, jumperDamageStack, isQueued
}: GameCardProps) {
    const [imgError, setImgError] = useState(false);

    const colors = CARD_COLORS[card.type || 'default'] ?? CARD_COLORS.default;
    const costStr = card.cost === 'all_energy' ? 'ALL' : (card.cost ?? '?');
    const defaultFrameNames: Record<string, string> = { attack: 'attack_frame.png', magic: 'magic_frame.png', support: 'support_frame.png', defense: 'support_frame.png' };
    const frameBasename = card.type ? (defaultFrameNames[card.type] || 'support_frame.png') : 'support_frame.png';
    const frameUrl = imgUrl(card.ui?.frame) || `/images/${frameBasename}`;
    const illustrationUrl = imgUrl(card.ui?.illustration) || `/images/${card.id}.jpg`;
    const typeEmoji = card.type === 'attack' ? '⚔️' : card.type === 'magic' ? '✨' : card.type === 'support' ? '💚' : card.type === 'defense' ? '🛡️' : '🃏';

    const baseId = card.originalId || card.id;
    let displayEffect = card.effect || card.logic_detail || '설명이 없습니다.';
    if ((baseId === 'weakness_strike' || baseId === 'wide_strike') && jumperDamageStack !== undefined) {
        const currentDmg = 1 * Math.pow(2, jumperDamageStack);
        displayEffect = displayEffect.replace('1*', `${currentDmg}`);
    }

    const filterStyle = isQueued
        ? 'brightness(0.3) grayscale(0.8)'
        : (disabled && !errorShake ? 'brightness(0.5) grayscale(0.5)' : 'none');

    return (
        <Tooltip label={displayEffect} multiline w={200} position="top" withArrow transitionProps={{ duration: 200 }} disabled={drag || disabled} zIndex={1000}>
            <motion.div layout drag={disabled ? false : drag} dragSnapToOrigin onDragStart={onDragStart} onDragEnd={onDragEnd} initial={initial} transition={transition} whileHover={whileHover} whileTap={whileTap} animate={errorShake ? { x: [-5, 5, -5, 5, 0], transition: { duration: 0.2 } } : animate} exit={exit} onClick={onClick} style={{ width: '140px', height: '200px', flexShrink: 0, position: 'absolute', pointerEvents: disabled && !errorShake ? 'none' : 'auto', cursor: disabled ? 'not-allowed' : (drag ? 'grab' : 'pointer'), borderRadius: '12px', overflow: 'hidden', boxShadow: errorShake ? `0 0 20px rgba(255,0,0,0.8), 0 4px 12px rgba(0,0,0,0.8)` : selected ? `0 0 25px ${colors.accent}, 0 6px 16px rgba(0,0,0,0.9)` : `0 8px 24px rgba(0,0,0,0.9)`, filter: filterStyle, transformOrigin: 'bottom center', ...style }}>
                <div style={{ position: 'absolute', inset: 0, backgroundImage: `url("${frameUrl}")`, backgroundSize: '100% 100%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', borderRadius: '12px', boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)' }} />
                {selected && <div style={{ position: 'absolute', inset: 0, border: `3px solid var(--accent-gold)`, borderRadius: '12px', boxShadow: `0 0 20px var(--accent-gold), inset 0 0 10px var(--accent-gold)`, pointerEvents: 'none', zIndex: 10 }} />}
                <div style={{ position: 'absolute', top: '2%', left: '3%', right: '3%', height: '58%', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: '8px 8px 0 0', boxShadow: 'inset 0 0 10px rgba(0,0,0,0.8), 0 2px 5px rgba(0,0,0,0.5)', backgroundColor: '#111' }}>
                    {illustrationUrl && !imgError ? <img src={illustrationUrl} alt={card.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={() => setImgError(true)} /> : <span style={{ fontSize: '50px' }}>{typeEmoji}</span>}
                </div>
                <div style={{ position: 'absolute', top: '-8px', left: '-8px', zIndex: 15, width: '32px', height: '32px', borderRadius: '50%', background: `radial-gradient(circle at top left, #555, #111)`, border: `2px solid #E6C36A`, color: '#fff', fontSize: '14px', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 8px rgba(0,0,0,0.8), inset 0 2px 4px rgba(255,255,255,0.3)', textShadow: '0 2px 4px #000', fontFamily: 'var(--font-fantasy)' }}>{costStr}</div>
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', zIndex: 3, background: 'linear-gradient(to bottom, rgba(20,20,25,0.9) 0%, rgba(10,10,15,1) 100%)', borderTop: `2px solid ${colors.border}`, display: 'flex', flexDirection: 'column', padding: '4px 8px', borderRadius: '0 0 12px 12px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 900, color: colors.accent, textShadow: '0 2px 4px #000', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: 'var(--font-fantasy)', textAlign: 'center', marginBottom: '4px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '2px' }}>{card.name}</div>
                    <div style={{ fontSize: '10px', color: '#ccc', lineHeight: 1.3, textShadow: '0 1px 2px #000', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', textAlign: 'center' }}>
                        {displayEffect}
                    </div>
                </div>
                <div style={{ position: 'absolute', bottom: '6px', left: 0, right: 0, textAlign: 'center', fontSize: '9px', color: '#666', fontWeight: 800, letterSpacing: '1px', textShadow: '0px 1px 1px #000', zIndex: 3 }}>{card.type?.toUpperCase()}</div>
            </motion.div>
        </Tooltip>
    );
}