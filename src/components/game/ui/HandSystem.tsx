"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { GameCard3D } from './Card';
import type { Card } from '../../../types';
import { SoundEngine } from '../../../engine/soundEngine';

interface HandSystemProps {
    hand: Card[];
    selectedCardId: string | null;
    onSelectCard: (id: string) => void;
    isTargeting?: boolean;
    disabled?: boolean;
    currentEnergy: number;
    usedEnergy: number;
    jumperDamageStack?: number;
    queuedCardIds?: string[];
    isDiscarding?: boolean;
}

export function HandSystem({ hand, selectedCardId, onSelectCard, disabled, currentEnergy, usedEnergy, jumperDamageStack, queuedCardIds = [], isDiscarding = false }: HandSystemProps) {
    const total = hand.length;
    const centerIdx = (total - 1) / 2;
    const calcCost = (c: Card) => c.cost === 'all_energy' ? currentEnergy : (typeof c.cost === 'number' ? c.cost : 0);

    return (
        <div style={{ position: 'relative', width: '100%', height: '240px', display: 'flex', justifyContent: 'center', alignItems: 'flex-end', perspective: '1000px' }}>
            <AnimatePresence>
                {hand.map((card, i) => {
                    const isSelected = selectedCardId === card.id;
                    const isQueued = (queuedCardIds || []).includes(card.id);
                    const offset = i - centerIdx;
                    const rotateZ = offset * 6;
                    const translateX = offset * 70;
                    const translateY = Math.abs(offset) * 10 + (isSelected ? -40 : 0);
                    const cardCost = calcCost(card);

                    const isPassive = card.originalId === 'blink' || card.id === 'blink';
                    const isPlayable = isDiscarding ? true : (!isPassive && currentEnergy - usedEnergy >= cardCost);

                    const errorShake = !isPlayable && !disabled && isSelected;
                    const errShakeY = errorShake ? [translateY - 5, translateY + 5, translateY - 5, translateY + 5, translateY] : translateY;
                    const zIndex = isSelected ? 100 : i + 10;

                    return (
                        <div 
                            key={card.id} 
                            style={{ position: 'absolute', zIndex: zIndex }}
                            onMouseEnter={() => { if (!disabled && !isQueued) SoundEngine.play('ui_card_hover'); }}
                        >
                            <GameCard3D
                                card={card}
                                disabled={disabled || (!isPlayable && !isSelected) || isQueued}
                                selected={isSelected}
                                errorShake={errorShake}
                                jumperDamageStack={jumperDamageStack}
                                isQueued={isQueued}
                                onClick={() => { 
                                    if (!disabled && !isQueued) {
                                        SoundEngine.play(isPlayable ? 'ui_card_select' : 'ui_error');
                                        onSelectCard(card.id); 
                                    }
                                }}
                                initial={{ opacity: 0, x: -250, y: 150, scale: 0.5 }}
                                animate={{ opacity: 1, x: translateX, y: errShakeY, rotate: rotateZ, scale: errorShake ? [1, 1.05, 1, 1.05, 1] : 1 }}
                                whileHover={(disabled || isQueued) ? undefined : { scale: 1.25, y: translateY - 40, rotateZ: 0, rotateY: 5, zIndex: 80, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
                                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                exit={{ opacity: 0, y: -200, scale: 1.2 }}
                            />
                        </div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
}