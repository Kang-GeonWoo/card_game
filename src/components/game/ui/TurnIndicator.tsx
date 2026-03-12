"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function TurnIndicator({ turnLabel }: { turnLabel: string | null }) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (turnLabel) {
            setShow(true);
            const timer = setTimeout(() => setShow(false), 1500); // 1.5초 후 사라짐
            return () => clearTimeout(timer);
        } else {
            setShow(false);
        }
    }, [turnLabel]);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{
                        position: 'fixed', inset: 0,
                        zIndex: 9999,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        // 다크 비네트 배경
                        background: 'radial-gradient(circle, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.9) 100%)',
                        pointerEvents: 'none',
                    }}
                >
                    <motion.h1
                        initial={{ scale: 0.5, y: 50, opacity: 0 }}
                        animate={{ scale: 1.2, y: 0, opacity: 1 }}
                        exit={{ scale: 1.8, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                        style={{
                            fontFamily: 'var(--font-fantasy)',
                            fontSize: '6rem',
                            fontWeight: 900,
                            color: '#E6C36A',
                            textShadow: '0 0 20px rgba(230, 195, 106, 0.8), 0 10px 30px rgba(0,0,0,1)',
                            letterSpacing: '8px',
                            margin: 0,
                        }}
                    >
                        {turnLabel}
                    </motion.h1>
                </motion.div>
            )}
        </AnimatePresence>
    );
}