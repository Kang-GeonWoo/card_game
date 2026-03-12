import { ServerGameEngine } from './GameEngine';
import { Action, GameState } from '../types';
import { Server, Socket } from 'socket.io';

export interface RoomState {
    roomId: string;
    engine: ServerGameEngine;
    playerSockets: string[]; // List of socket IDs in this room
    expireTimer: NodeJS.Timeout | null;
}

export class RoomManager {
    private rooms = new Map<string, RoomState>();
    private userRoomMap = new Map<string, string>(); // socketId -> roomId
    private matchQueue: { socketId: string, deck: string[], charId: string }[] = [];
    private io: Server;

    constructor(io: Server) {
        this.io = io;
    }

    public joinMatchQueue(socketId: string, deck: string[], charId: string) {
        console.log(`[RoomManager] joinMatchQueue 호출됨. (Socket: ${socketId}, Char: ${charId})`);
        
        // 이미 큐에 있거나 룸에 있으면 무시
        if (this.matchQueue.find(q => q.socketId === socketId)) {
            console.log(`[RoomManager] 실패: 이미 큐에 대기 중입니다. (${socketId})`);
            return;
        }
        if (this.userRoomMap.has(socketId)) {
            console.log(`[RoomManager] 실패: 이미 방에 접속되어 있습니다. (${socketId})`);
            return;
        }

        this.matchQueue.push({ socketId, deck, charId });
        console.log(`[RoomManager] 대기열 등록 완료. 현재 큐 인원: ${this.matchQueue.length}명`);

        this.processQueue();
    }

    private processQueue() {
        if (this.matchQueue.length >= 2) {
            const p1 = this.matchQueue.shift()!;
            const p2 = this.matchQueue.shift()!;
            
            const roomId = this.generateRoomId();
            this.createRoom(roomId, [p1.socketId, p2.socketId], p1, p2);
        }
    }

    public createRoom(roomId: string, socketIds: string[], p1Info?: any, p2Info?: any) {
        const engine = new ServerGameEngine();
        
        this.rooms.set(roomId, {
            roomId,
            engine,
            playerSockets: socketIds,
            expireTimer: null
        });

        // Set mapping
        socketIds.forEach(id => {
            this.userRoomMap.set(id, roomId);
        });

        console.log(`[RoomManager] Room created: ${roomId} with players:`, socketIds);

        // Notify players that match is found
        if (p1Info && p2Info) {
            // 엔진에 유저 초기 세팅 (drawPile, hand 분배는 서버에서 확정)
            engine.initPlayer(p1Info.socketId, p1Info.charId, p1Info.deck, 0, 2);
            engine.initPlayer(p2Info.socketId, p2Info.charId, p2Info.deck, 2, 0);
            
            engine.startGame(); // planning 상태로 전환

            // MATCH_FOUND 브로드캐스트
            const initialState = engine.getState();
            this.io.to(p1Info.socketId).emit('MATCH_FOUND', { roomId, state: initialState, myId: p1Info.socketId });
            this.io.to(p2Info.socketId).emit('MATCH_FOUND', { roomId, state: initialState, myId: p2Info.socketId });
        }
    }

    public getRoomBySocketId(socketId: string): RoomState | undefined {
        const roomId = this.userRoomMap.get(socketId);
        if (roomId) {
            return this.rooms.get(roomId);
        }
        return undefined;
    }

    // ============================================
    // 액션 버퍼 및 동기화 루프 이식 (Step 2)
    // ============================================
    public handleActionSubmit(socketId: string, actionQueue: Action[]) {
        const room = this.getRoomBySocketId(socketId);
        if (!room) return;

        console.log(`[RoomManager] User ${socketId} submitted actions for room ${room.roomId}.`);
        const engine = room.engine;
        
        // 1. 유저의 액션을 엔진 버퍼에 등록
        engine.setAction(socketId, actionQueue);

        // 2. 양쪽 모두 제출 완료 상태인지 체크 (Simultaneous Resolution)
        if (engine.isBothReady()) {
            console.log(`[RoomManager] Both players ready in room ${room.roomId}. Triggering resolution.`);
            
            // 3. 서버 엔진에서 다음 턴 결과 계산
            const snapshots = engine.resolveTurnFull();
            console.log(`[RoomManager] resolveTurnFull 처리 완료. 생성된 스냅샷 수: ${snapshots?.length}`);

            // 4. 연산된 애니메이션 스냅샷 배열을 각각의 플레이어에게 직접 전송
            room.playerSockets.forEach(sid => {
                this.io.to(sid).emit('TURN_RESULT', { snapshots });
            });
        }
    }

    public handleCardDiscard(socketId: string, cardInstanceId: string) {
        const room = this.getRoomBySocketId(socketId);
        if (!room) return;

        const success = room.engine.discardCard(socketId, cardInstanceId);
        if (success) {
            console.log(`[RoomManager] User ${socketId} discarded card. Broadcasting STATE_SYNC.`);
            // 새로 갱신된 상태(또는 턴이 넘어간 상태)를 방 전체에 동기화
            room.playerSockets.forEach(sid => {
                this.io.to(sid).emit('STATE_SYNC', { state: room.engine.getState() });
            });
        }
    }

    // ============================================
    // 연결 관리
    // ============================================
    public handleDisconnect(socketId: string) {
        const room = this.getRoomBySocketId(socketId);
        if (room) {
            console.log(`[RoomManager] User ${socketId} disconnected from room ${room.roomId}. Setting expiry timer (30s).`);
            
            // Set 30s timeout to clear room to prevent memory leaks if they don't reconnect
            if (!room.expireTimer) {
                room.expireTimer = setTimeout(() => {
                    this.destroyRoom(room.roomId);
                }, 30000);
            }
        }
    }

    public handleReconnect(socketId: string, oldSocketId: string) {
        const roomId = this.userRoomMap.get(oldSocketId);
        if (roomId) {
            const room = this.rooms.get(roomId);
            if (room) {
                // Clear the expiry timer
                if (room.expireTimer) {
                    clearTimeout(room.expireTimer);
                    room.expireTimer = null;
                }

                // Update mapping
                this.userRoomMap.delete(oldSocketId);
                this.userRoomMap.set(socketId, roomId);

                // Update socket references within the room
                const idx = room.playerSockets.indexOf(oldSocketId);
                if (idx !== -1) {
                    room.playerSockets[idx] = socketId;
                }

                // Update engine internal state keys
                room.engine.replacePlayerId(oldSocketId, socketId);

                console.log(`[RoomManager] User reconnected to room ${roomId}. Old Socket: ${oldSocketId}, New Socket: ${socketId}`);
            }
        }
    }

    // ============================================
    // 세션 클린업 및 방 나가기 (Step 1 추가)
    // ============================================
    public leaveRoom(socketId: string) {
        const roomId = this.userRoomMap.get(socketId);
        if (roomId) {
            const room = this.rooms.get(roomId);
            if (room) {
                // 방의 플레이어 목록에서 해당 유저 제거
                room.playerSockets = room.playerSockets.filter(id => id !== socketId);
                
                // 엔진 내부의 플레이어 정보도 초기화(옵션)하거나 방 자체를 파괴할 수도 있음
                // 지금은 1v1 게임이므로 한 명이 나가면 방 자체를 파기하는 것이 안전
                this.destroyRoom(roomId);
            }
            this.userRoomMap.delete(socketId);
            console.log(`[RoomManager] User ${socketId} explicitly left room ${roomId}.`);
        }
        
        // 매칭 큐에 있었다면 큐에서도 제거
        const qIdx = this.matchQueue.findIndex(q => q.socketId === socketId);
        if (qIdx !== -1) {
            this.matchQueue.splice(qIdx, 1);
            console.log(`[RoomManager] User ${socketId} removed from match queue.`);
        }
    }

    public destroyRoom(roomId: string) {
        const room = this.rooms.get(roomId);
        if (room) {
            if (room.expireTimer) {
                clearTimeout(room.expireTimer);
            }
            room.playerSockets.forEach(id => {
                this.userRoomMap.delete(id);
            });
            this.rooms.delete(roomId);
            console.log(`[RoomManager] Room destroyed and memory cleared: ${roomId}`);
        }
    }

    public generateRoomId(): string {
        return Math.random().toString(36).substring(2, 9);
    }
}
