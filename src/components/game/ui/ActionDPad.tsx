"use client";

import { Group, ActionIcon, Stack } from '@mantine/core';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

interface ActionDPadProps {
    onMove: (dx: number, dy: number) => void;
    disabled?: boolean;
}

export function ActionDPad({ onMove, disabled }: ActionDPadProps) {
    const btnStyle = {
        background: 'rgba(20, 20, 30, 0.8)',
        border: '1px solid #444',
        boxShadow: '0 4px 6px rgba(0,0,0,0.5)',
        color: '#ccc',
        transition: 'all 0.2s',
    };

    const activeStyle = {
        ...btnStyle,
        '&:hover': {
            background: 'rgba(60, 60, 80, 0.9)',
            borderColor: '#666',
            color: '#fff',
        }
    };

    return (
        <Stack gap={4} align="center" justify="center" p="xs" style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '12px', border: '1px solid #333' }}>
            <ActionIcon
                size="lg"
                disabled={disabled}
                onClick={() => onMove(0, -1)}
                styles={{ root: disabled ? btnStyle : activeStyle }}
            >
                <ArrowUp size={20} />
            </ActionIcon>
            <Group gap={4}>
                <ActionIcon
                    size="lg"
                    disabled={disabled}
                    onClick={() => onMove(-1, 0)}
                    styles={{ root: disabled ? btnStyle : activeStyle }}
                >
                    <ArrowLeft size={20} />
                </ActionIcon>
                {/* Center empty space */}
                <div style={{ width: '38px', height: '38px' }} />
                <ActionIcon
                    size="lg"
                    disabled={disabled}
                    onClick={() => onMove(1, 0)}
                    styles={{ root: disabled ? btnStyle : activeStyle }}
                >
                    <ArrowRight size={20} />
                </ActionIcon>
            </Group>
            <ActionIcon
                size="lg"
                disabled={disabled}
                onClick={() => onMove(0, 1)}
                styles={{ root: disabled ? btnStyle : activeStyle }}
            >
                <ArrowDown size={20} />
            </ActionIcon>
        </Stack>
    );
}