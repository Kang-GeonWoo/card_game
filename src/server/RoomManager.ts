// src/server/RoomManager.ts
import { ServerGameEngine } from './GameEngine';
import { Action, GameState } from '../types';
import { Server } from 'socket.io';

export interface RoomState {
    roomId: string;
    engine: ServerGameEngine;
    playerSockets: string[];    // 소켓 ID 목록
    playerUserIds: string[];    // 유저 DB ID 목록 (랭크 점수 갱신용)
    isFriendly: boolean;        // 친선전 여부
    expireTimer: NodeJS.Timeout | null;
}

export class RoomManager {
    private rooms = new Map<string, RoomState>();
    private userRoomMap = new Map<string, string>();   // socketId → roomId

    // 💡 랭크 매칭 대기열 (점수 + 입장시간 포함)
    private matchQueue: {
        socketId: string;
        deck: string[];
        charId: string;
        rank: number;
        userId: string;
        joinedAt: number;
    }[] = [];

    // 💡 친선전 대기열 (방 코드 → 플레이어 목록)
    private customRooms = new Map<string, any[]>();

    private io: Server;
    private prisma: any; // 생성자에서 주입받음

    constructor(io: Server, prisma?: any) {
        this.io = io;
        this.prisma = prisma;
        // 💡 5초마다 랭크 매칭 시도 (대기시간이 길수록 범위 확대)
        setInterval(() => this.processRankMatch(), 5000);
    }

    // ────────────────────────────────────────────
    //  💡 랭크 매칭 큐 등록
    // ────────────────────────────────────────────
    public joinMatchQueue(
        socketId: string,
        deck: string[],
        charId: string,
        rank: number,
        userId: string
    ) {
        console.log(`[RoomManager] joinMatchQueue: ${socketId} / rank:${rank}`);

        // 이미 큐에 있거나 방에 있으면 무시
        if (this.matchQueue.some(q => q.socketId === socketId)) {
            console.log(`[RoomManager] 이미 큐에 있습니다: ${socketId}`);
            return;
        }
        if (this.userRoomMap.has(socketId)) {
            console.log(`[RoomManager] 이미 방에 있습니다: ${socketId}`);
            return;
        }

        this.matchQueue.push({ socketId, deck, charId, rank, userId, joinedAt: Date.now() });
        this.io.to(socketId).emit('MATCH_STATUS', '매칭 대기 중...');
        console.log(`[RoomManager] 대기열 등록 완료. 현재 큐: ${this.matchQueue.length}명`);
    }

    // 💡 [매칭 취소] 랭크 큐 및 친선전 대기열에서 소켓 제거
    public cancelMatch(socketId: string) {
        // 랭크 매칭 큐에서 제거
        const qIdx = this.matchQueue.findIndex(q => q.socketId === socketId);
        if (qIdx !== -1) {
            this.matchQueue.splice(qIdx, 1);
            console.log(`[MatchCancel] ${socketId} 랭크 큐 이탈. 남은 인원: ${this.matchQueue.length}명`);
        }

        // 친선전 대기열에서도 제거 (forEach는 Map 내장 메서드라 에러 없음)
        this.customRooms.forEach((players, code) => {
            const filtered = players.filter((p: any) => p.socketId !== socketId);
            if (filtered.length === 0) this.customRooms.delete(code);
            else this.customRooms.set(code, filtered);
        });
    }

    // 💡 [랭크 매칭 처리] 5초마다 호출, 대기시간이 길수록 허용 점수 차이 확대
    private processRankMatch() {
        if (this.matchQueue.length < 2) return;

        for (let i = 0; i < this.matchQueue.length; i++) {
            for (let j = i + 1; j < this.matchQueue.length; j++) {
                const p1 = this.matchQueue[i];
                const p2 = this.matchQueue[j];

                // 대기 시간(초)에 따라 허용 점수 차이 계산 (1초당 10점 확대, 최대 500점)
                const waitSec = (Date.now() - p1.joinedAt) / 1000;
                const allowedDiff = Math.min(100 + waitSec * 10, 500);

                if (Math.abs(p1.rank - p2.rank) <= allowedDiff) {
                    // 큐에서 두 플레이어 제거 후 배틀 시작
                    this.matchQueue.splice(j, 1);
                    this.matchQueue.splice(i, 1);
                    console.log(`[RoomManager] 랭크 매칭 성공! ${p1.socketId} vs ${p2.socketId}`);
                    this.startBattle(p1, p2, false);
                    return;
                }
            }
        }
    }

    // ────────────────────────────────────────────
    //  💡 친선전 방 입장/매칭
    // ────────────────────────────────────────────
    public joinCustomRoom(
        socketId: string,
        deck: string[],
        charId: string,
        roomCode: string,
        userId: string
    ) {
        let players = this.customRooms.get(roomCode) || [];
        players.push({ socketId, deck, charId, userId, rank: 1000 });

        if (players.length >= 2) {
            // 2명이 모이면 즉시 배틀 시작
            const p1 = players[0];
            const p2 = players[1];
            this.customRooms.delete(roomCode);
            console.log(`[RoomManager] 친선전 매칭! 코드:${roomCode}, ${p1.socketId} vs ${p2.socketId}`);
            this.startBattle(p1, p2, true);
        } else {
            // 첫 번째 플레이어는 대기
            this.customRooms.set(roomCode, players);
            this.io.to(socketId).emit('MATCH_STATUS', `친선전 대기 중... (방 코드: ${roomCode})`);
            console.log(`[RoomManager] 친선전 대기 중. 코드: ${roomCode}`);
        }
    }

    // ────────────────────────────────────────────
    //  배틀 시작 (랭크/친선 공통)
    // ────────────────────────────────────────────
    private startBattle(p1: any, p2: any, isFriendly: boolean) {
        const roomId = this.generateRoomId();
        const engine = new ServerGameEngine();

        engine.initPlayer(p1.socketId, p1.charId, p1.deck, 0, 2);
        engine.initPlayer(p2.socketId, p2.charId, p2.deck, 2, 0);
        engine.startGame();

        this.rooms.set(roomId, {
            roomId,
            engine,
            playerSockets: [p1.socketId, p2.socketId],
            playerUserIds: [p1.userId, p2.userId],
            isFriendly,
            expireTimer: null,
        });

        [p1.socketId, p2.socketId].forEach(sid => {
            this.userRoomMap.set(sid, roomId);
        });

        const initialState = engine.getState();
        this.io.to(p1.socketId).emit('MATCH_FOUND', { roomId, state: initialState, myId: p1.socketId });
        this.io.to(p2.socketId).emit('MATCH_FOUND', { roomId, state: initialState, myId: p2.socketId });
        console.log(`[RoomManager] 배틀 시작! Room:${roomId} / 친선전: ${isFriendly}`);
    }

    // ────────────────────────────────────────────
    //  액션 처리
    // ────────────────────────────────────────────
    public getRoomBySocketId(socketId: string): RoomState | undefined {
        const roomId = this.userRoomMap.get(socketId);
        return roomId ? this.rooms.get(roomId) : undefined;
    }

    public handleActionSubmit(socketId: string, actionQueue: Action[]) {
        const room = this.getRoomBySocketId(socketId);
        if (!room) return;

        const engine = room.engine;
        engine.setAction(socketId, actionQueue);

        if (engine.isBothReady()) {
            console.log(`[RoomManager] 양쪽 액션 제출 완료. Room:${room.roomId}`);
            const snapshots = engine.resolveTurnFull();

            room.playerSockets.forEach(sid => {
                this.io.to(sid).emit('TURN_RESULT', { snapshots });
            });

            // 💡 게임 종료 체크 및 랭크 점수 반영
            const finalState = engine.getState();
            if (finalState.status === 'game_over') {
                this.applyRankResult(room, finalState);
            }
        }
    }

    // 💡 [랭크 점수 처리] 승자 +20점, 패자 -20점 (친선전은 제외)
    private async applyRankResult(room: RoomState, state: GameState) {
        if (room.isFriendly || !this.prisma) return;

        try {
            const [p1SocketId, p2SocketId] = room.playerSockets;
            const [p1UserId, p2UserId] = room.playerUserIds;
            const p1State = state.players[p1SocketId];
            const p2State = state.players[p2SocketId];

            if (!p1State || !p2State) return;

            // HP가 더 높은 쪽이 승자
            const p1Won = p1State.hp > p2State.hp;
            const RANK_CHANGE = 20;

            await Promise.all([
                this.prisma.user.update({
                    where: { id: p1UserId },
                    data: { rankScore: { increment: p1Won ? RANK_CHANGE : -RANK_CHANGE } }
                }),
                this.prisma.user.update({
                    where: { id: p2UserId },
                    data: { rankScore: { increment: p1Won ? -RANK_CHANGE : RANK_CHANGE } }
                }),
            ]);

            console.log(`[Rank] ${p1UserId} ${p1Won ? '+' : '-'}${RANK_CHANGE}, ${p2UserId} ${p1Won ? '-' : '+'}${RANK_CHANGE}`);
        } catch (err) {
            console.error('[Rank] 점수 갱신 실패:', err);
        }
    }

    public handleCardDiscard(socketId: string, cardInstanceId: string) {
        const room = this.getRoomBySocketId(socketId);
        if (!room) return;

        const success = room.engine.discardCard(socketId, cardInstanceId);
        if (success) {
            room.playerSockets.forEach(sid => {
                this.io.to(sid).emit('STATE_SYNC', { state: room.engine.getState() });
            });
        }
    }

    // ────────────────────────────────────────────
    //  연결 관리 / 클린업
    // ────────────────────────────────────────────
    public leaveRoom(socketId: string) {
        const roomId = this.userRoomMap.get(socketId);
        if (roomId) {
            const room = this.rooms.get(roomId);
            if (room) {
                room.playerSockets = room.playerSockets.filter(id => id !== socketId);
                this.destroyRoom(roomId);
            }
            this.userRoomMap.delete(socketId);
            console.log(`[RoomManager] ${socketId} 방 나감. Room:${roomId}`);
        }

        // 매칭 큐에서도 제거
        const qIdx = this.matchQueue.findIndex(q => q.socketId === socketId);
        if (qIdx !== -1) {
            this.matchQueue.splice(qIdx, 1);
            console.log(`[RoomManager] ${socketId} 매칭 큐에서 제거됨`);
        }

        // 💡 친선전 대기 중이었다면 제거 (Array.from으로 MapIterator 오류 방지)
        Array.from(this.customRooms.entries()).forEach(([code, players]: [string, any[]]) => {
            const filtered = players.filter((p: any) => p.socketId !== socketId);
            if (filtered.length === 0) this.customRooms.delete(code);
            else this.customRooms.set(code, filtered);
        });
    }

    public destroyRoom(roomId: string) {
        const room = this.rooms.get(roomId);
        if (room) {
            if (room.expireTimer) clearTimeout(room.expireTimer);
            room.playerSockets.forEach(id => this.userRoomMap.delete(id));
            this.rooms.delete(roomId);
            console.log(`[RoomManager] Room 파기: ${roomId}`);
        }
    }

    public handleReconnect(socketId: string, oldSocketId: string) {
        const roomId = this.userRoomMap.get(oldSocketId);
        if (!roomId) return;
        const room = this.rooms.get(roomId);
        if (!room) return;

        if (room.expireTimer) { clearTimeout(room.expireTimer); room.expireTimer = null; }

        this.userRoomMap.delete(oldSocketId);
        this.userRoomMap.set(socketId, roomId);

        const idx = room.playerSockets.indexOf(oldSocketId);
        if (idx !== -1) room.playerSockets[idx] = socketId;

        room.engine.replacePlayerId(oldSocketId, socketId);
        console.log(`[RoomManager] 재접속. Old:${oldSocketId} → New:${socketId}`);
    }

    public generateRoomId(): string {
        return Math.random().toString(36).substring(2, 9);
    }
}
