"use client";

import { Stack, Button, Text } from '@mantine/core';
import { MousePointer2, Sword, BookOpen, BatteryCharging } from 'lucide-react';

export type ActionCommandType = 'move' | 'play_card' | 'draw' | 'rest';

interface ActionPanelProps {
    currentCommand: ActionCommandType | null;
    onCommandSelect: (cmd: ActionCommandType) => void;
    disabled?: boolean;
}

export function ActionPanel({ currentCommand, onCommandSelect, disabled }: ActionPanelProps) {
    const commands: { id: ActionCommandType; label: string; icon: React.ReactNode; costLabel: string }[] = [
        { id: 'move', label: '이동', icon: <MousePointer2 size={18} />, costLabel: '(턴 소모)' },
        { id: 'play_card', label: '카드 사용', icon: <Sword size={18} />, costLabel: '(기력 소모)' },
        { id: 'draw', label: '카드 뽑기', icon: <BookOpen size={18} />, costLabel: '(턴 소모)' },
        { id: 'rest', label: '기력 회복', icon: <BatteryCharging size={18} />, costLabel: '(턴 소모)' },
    ];

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', width: '100%' }}>
            {commands.map(cmd => {
                const isSelected = currentCommand === cmd.id;
                // 'play_card'는 황금색, 나머지는 푸른색 톤으로 시안 반영
                const isCardCmd = cmd.id === 'play_card';
                const baseColor = isCardCmd ? '#E6C36A' : '#3FA7FF';
                const darkColor = isCardCmd ? '#4A3B1C' : '#1A334A';

                return (
                    <Button
                        key={cmd.id}
                        size="md"
                        disabled={disabled}
                        onClick={() => onCommandSelect(cmd.id)}
                        styles={{
                            root: {
                                height: '48px',
                                padding: '0 8px',
                                border: isSelected ? `2px solid ${baseColor}` : '1px solid #444',
                                background: isSelected
                                    ? `linear-gradient(180deg, ${darkColor} 0%, #111 100%)`
                                    : 'linear-gradient(180deg, #222 0%, #111 100%)',
                                boxShadow: isSelected ? `0 0 10px ${baseColor}60, inset 0 2px 4px rgba(255,255,255,0.1)` : 'inset 0 2px 4px rgba(255,255,255,0.05)',
                                transition: 'all 0.2s ease',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            },
                            inner: { width: '100%' },
                            label: { width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }
                        }}
                    >
                        <div style={{ color: isSelected ? baseColor : '#888', display: 'flex', alignItems: 'center' }}>
                            {cmd.icon}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', lineHeight: 1.1 }}>
                            <Text size="sm" fw={800} c={isSelected ? '#fff' : 'gray.4'} style={{ fontFamily: 'var(--font-fantasy)', textShadow: isSelected ? `0 0 5px ${baseColor}` : 'none' }}>
                                {cmd.label}
                            </Text>
                            <Text size="xs" c={isSelected ? '#ccc' : '#666'}>
                                {cmd.costLabel}
                            </Text>
                        </div>
                    </Button>
                );
            })}
        </div>
    );
}