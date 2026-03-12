"use client";
import { create } from 'zustand';
import type { GameState, PlayerState, Action, Card, VisualEffect } from '../types';
import { SoundEngine } from './soundEngine';

export const INITIAL_PLAYER_STATE: PlayerState = {
    id: '', characterId: 'warrior', hp: 100, shield: 0, energy: 100, position: { x: 0, y: 0 },
    drawPile: [], hand: [], discardPile: [], statuses: [], skillLevel: 0, shuffleCount: 0,
    jumperDamageStack: 0, actionQueue: [{ type: 'none' as const }, { type: 'none' as const }, { type: 'none' as const }], isReady: false
};

interface GameStore extends GameState {
    myId: string | null;
    // TCB v3.0: 서버 주도형(Server Authority)을 위한 상태 덮어쓰기 메서드
    syncState: (serverState: GameState, myId?: string) => void;
    playReplays: (snapshots: GameState[]) => void;
    
    // 오프라인/디버그용 더미 (이제 실제 연산 안 함)
    initGame: (selectedDeckIds?: string[], characterId?: string) => void;
    appendAction: (playerId: string, action: Action) => void;
    unstageAction: (playerId: string, index: number) => void;
    setReady: (playerId: string) => void;
    discardHandCard: (playerId: string, cardInstanceId: string) => void;
    
    // 클라이언트 UI 전용 (이펙트/애니메이션 제거)
    removeVisualEffect: (id: string) => void;
    closePeekingCards: () => void;
    showSkillCutin: (charId: string) => void;
    
    // 로비 귀환 초기화용
    reset: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
    myId: null,
    status: 'lobby', resolvingStep: 0, resolvingPhase: 0, visualEffects: [],
    players: { },
    lastPlayedCard: { player1: null, player2: null }, activeSkillCutin: null, isScreenShaking: false, peekingCards: null, turnCount: 1, logs: ['서버 접속을 대기 중입니다...'],

    syncState: (serverState: GameState, myId?: string) => {
        if (myId) {
            set({ ...serverState, myId });
        } else {
            set((state) => ({ ...serverState, myId: state.myId }));
        }
    },

    playReplays: (snapshots: GameState[]) => {
        if (!snapshots || !Array.isArray(snapshots) || snapshots.length === 0) {
            console.warn('[Store] playReplays 예외 발생: 유효하지 않은 snapshots 데이터(빈 배열 또는 undefined)가 수신되었습니다.', snapshots);
            return;
        }
        console.log(`[Store] [Replay] Starting animation sequence! 총 ${snapshots.length}개의 스냅샷을 순차적으로 렌더링합니다.`);
        let delay = 0;
        snapshots.forEach((snap, idx) => {
            setTimeout(() => {
                const currentMyId = get().myId;
                set({ ...snap, myId: currentMyId });
                // 진행 중에 이전 스냅샷의 이펙트 잔재 및 흔들림 정리 보장
                if (snap.status === 'resolving') {
                    if (snap.activeSkillCutin) {
                        SoundEngine.play('ui_turn_ready');
                    }
                    if (snap.visualEffects && snap.visualEffects.length > 0) {
                        const hasExplosionOrMagic = snap.visualEffects.some(v => v.type === 'explosion' || v.type === 'magic');
                        if (hasExplosionOrMagic) SoundEngine.play('skill_explosion');
                        else SoundEngine.play('combat_slash');
                        
                        // 추가로 에스퍼 사운드 연동
                        const isEsperAttack = snap.lastPlayedCard?.player1?.id === 'telekinesis_manipulation' || snap.lastPlayedCard?.player2?.id === 'telekinesis_manipulation';
                        if (isEsperAttack) SoundEngine.play('char_esper_psychic');
                    }
                }
            }, delay);
            // 각 스텝당 1000ms 간격 재생 (보기 편하도록)
            delay += 1000;
        });
    },

    initGame: (selectedDeckIds?: string[], characterId?: string) => {
        console.log('[Store] 클라이언트 단독 initGame 비활성화됨. 서버 매칭을 기다리세요.');
    },

    appendAction: (playerId: string, action: Action) => set((state) => {
        if (state.status !== 'planning') return state;
        const p = state.players[playerId];
        if (!p || p.isReady) return state;
        
        const newPlayers = JSON.parse(JSON.stringify(state.players));
        const emptyIdx = newPlayers[playerId].actionQueue.findIndex((a: Action) => a && a.type === 'none');
        if (emptyIdx === -1) return state;
        
        newPlayers[playerId].actionQueue[emptyIdx] = action;
        SoundEngine.play('ui_button_click');
        return { players: newPlayers };
    }),

    unstageAction: (playerId: string, index: number) => set((state) => {
        if (state.status !== 'planning') return state;
        const p = state.players[playerId];
        if (!p || p.isReady) return state;
        
        const newPlayers = JSON.parse(JSON.stringify(state.players));
        newPlayers[playerId].actionQueue[index] = { type: 'none' };
        for (let i = index; i < 2; i++) { 
            if (newPlayers[playerId].actionQueue[i + 1].type !== 'none') { 
                newPlayers[playerId].actionQueue[i] = newPlayers[playerId].actionQueue[i + 1]; 
                newPlayers[playerId].actionQueue[i + 1] = { type: 'none' }; 
            } 
        }
        SoundEngine.play('action_discard');
        return { players: newPlayers };
    }),

    setReady: (playerId: string) => set((state) => {
        // 클라이언트에서 Ready 상태만 만들고 소켓으로 ACTION_SUBMIT을 보내는 뼈대
        if (state.status !== 'planning') return state;
        const newPlayers = JSON.parse(JSON.stringify(state.players));
        const p = newPlayers[playerId];
        
        if (p.actionQueue.some((a: Action) => a.type === 'none')) return state; 
        
        p.isReady = true; 
        SoundEngine.play('ui_turn_ready'); 
        
        // TODO: 여기서 Socket.io로 actionQueue 전송 로직 필요 (컴포넌트 단에서 store.getState().players[playerId].actionQueue 참조하여 전송할 것)
        return { players: newPlayers };
    }),

    discardHandCard: (playerId: string, cardInstanceId: string) => set((state) => {
        const newPlayers = JSON.parse(JSON.stringify(state.players));
        const p = newPlayers[playerId];
        if (!p) return state;
        const idx = p.hand.findIndex((c: any) => c.id === cardInstanceId);
        if (idx !== -1) {
            const discarded = p.hand.splice(idx, 1)[0];
            p.discardPile.push(discarded);
            SoundEngine.play('action_discard');
            console.log(`[Store] Optimistically discarded card ${cardInstanceId}`);
        }
        return { players: newPlayers };
    }),

    removeVisualEffect: (id: string) => set((s) => ({ visualEffects: s.visualEffects.filter(e => e.id !== id) })),
    closePeekingCards: () => set({ peekingCards: null }),
    showSkillCutin: (charId: string) => set({ activeSkillCutin: charId }),

    reset: () => set((state) => ({ 
        status: 'lobby', resolvingStep: 0, resolvingPhase: 0, visualEffects: [],
        players: {}, lastPlayedCard: { player1: null, player2: null }, 
        activeSkillCutin: null, isScreenShaking: false, peekingCards: null, turnCount: 1, 
        logs: ['서버 접속을 대기 중입니다...'] 
    }))
}));