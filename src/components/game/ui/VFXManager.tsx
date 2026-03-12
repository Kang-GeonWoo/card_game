"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../../engine/store';

export function VFXManager() {
    const store = useGameStore();
    const myId = store.myId;
    const p1 = myId ? store.players[myId] : null;
    const opponentId = Object.keys(store.players).find(id => id !== myId);
    const p2 = opponentId ? store.players[opponentId] : null;

    const isP1Danger = p1 && p1.hp > 0 && p1.hp <= 20;
    const isExplosionActive = store.visualEffects.some(ef => ef.type === 'explosion' || ef.type === 'magic');

    return (
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 100, overflow: 'hidden' }}>
            <AnimatePresence>
                {isP1Danger && (
                    <motion.div key="vignette" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} style={{ position: 'absolute', inset: 0, backgroundImage: 'url("/effect_images/vignette_danger.png")', backgroundSize: '100% 100%', backgroundPosition: 'center', zIndex: 110, mixBlendMode: 'multiply', animation: 'vignette-fade 1.5s ease-in-out infinite' }} />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isExplosionActive && (
                    <motion.div key="focus-mask" initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} style={{ position: 'absolute', inset: 0, backgroundImage: 'url("/effect_images/focus_mask.png")', backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: 'rgba(0,0,0,0.45)', zIndex: 105, mixBlendMode: 'multiply' }} />
                )}
            </AnimatePresence>

            {/* 💡 필살기 컷인 연출 */}
            <AnimatePresence>
                {store.activeSkillCutin && (
                    <motion.div key="skill-cutin-bg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 200, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <div style={{ position: 'absolute', top: 0, width: '100%', height: '15%', backgroundColor: 'black' }} />
                        <div style={{ position: 'absolute', bottom: 0, width: '100%', height: '15%', backgroundColor: 'black' }} />
                        <motion.img src={`/chracter_images/${store.activeSkillCutin}_skill.png`} style={{ width: '100vw', height: 'auto', maxHeight: '70vh', objectFit: 'contain', transformStyle: 'preserve-3d', filter: 'drop-shadow(0 0 30px rgba(255,255,255,0.8))' }} animate={{ x: ["-100vw", "0vw", "0vw", "100vw"], skewX: ["-15deg", "-15deg", "-15deg", "-15deg"] }} transition={{ duration: 1.5, times: [0, 0.15, 0.85, 1], ease: "easeInOut" }} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}