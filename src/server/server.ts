// src/server/server.ts
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { decode } from 'next-auth/jwt';
import * as dotenv from 'dotenv';
import path from 'path';
import next from 'next';
import { PrismaClient } from '@prisma/client'; // 💡 DB 연동을 위해 추가

dotenv.config({ path: path.join(__dirname, '../../.env') });

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

const secret = process.env.NEXTAUTH_SECRET;
const PORT = process.env.PORT || 4000;

// 💡 서버 전용 Prisma 인스턴스 (랭크 점수 조회/갱신용)
const prisma = new PrismaClient();

// 💡 유저 ID와 소켓 ID를 매핑 (중복 로그인 체크용)
const userSocketMap = new Map<string, string>();

nextApp.prepare().then(() => {
    const app = express();
    const httpServer = createServer(app);

    const io = new Server(httpServer, {
        cors: {
            origin: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    // 소켓 인증 미들웨어
    io.use(async (socket, next) => {
        try {
            const cookieString = socket.request.headers.cookie;
            const tokenMatch = cookieString?.match(/next-auth\.session-token=([^;]+)/);
            const sessionToken = tokenMatch ? tokenMatch[1] : null;

            if (!sessionToken) return next(new Error('Authentication error'));

            const decoded = await decode({ token: sessionToken, secret: secret! });
            if (!decoded) return next(new Error('Authentication error'));

            const userId = (decoded as any).id;

            // 💡 [중복 로그인 차단 로직] 기존 세션이 있으면 강제 종료
            if (userSocketMap.has(userId)) {
                const oldSocketId = userSocketMap.get(userId);
                io.to(oldSocketId!).emit('KICK_OUT', '다른 기기에서 로그인이 시도되었습니다.');
                console.log(`[Kick] User ${userId}의 기존 세션(${oldSocketId})을 강제 종료합니다.`);
            }

            userSocketMap.set(userId, socket.id);
            (socket as any).user = decoded;
            next();
        } catch (error) {
            next(new Error('Authentication error'));
        }
    });

    // RoomManager 로딩
    const { RoomManager } = require('./RoomManager');
    const roomManager = new RoomManager(io, prisma); // 💡 prisma 주입

    io.on('connection', (socket) => {
        const user = (socket as any).user;
        console.log(`[Connected] ${user.name} (${socket.id})`);

        // 💡 [랭크 매칭] DB에서 실제 랭크 점수를 가져와서 큐에 넣음
        socket.on('MATCH_FIND', async (data) => {
            try {
                const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
                // 💡 prisma db push 전엔 rankScore 타입이 없을 수 있어 any로 안전하게 접근
                const rank = (dbUser as any)?.rankScore ?? 1000;
                console.log(`[Match] ${user.name} 랭크 매칭 요청. 점수: ${rank}`);
                roomManager.joinMatchQueue(socket.id, data.deck, data.charId, rank, user.id);
            } catch (err) {
                console.error('[Match] 유저 정보 조회 실패:', err);
                // DB 오류 시 기본값으로 큐 등록
                roomManager.joinMatchQueue(socket.id, data.deck, data.charId, 1000, user.id);
            }
        });

        // 💡 [친선전] 방 코드로 즉시 매칭
        socket.on('JOIN_CUSTOM_ROOM', (data) => {
            console.log(`[CustomRoom] ${user.name} 친선전 방 입장 시도. 코드: ${data.roomCode}`);
            roomManager.joinCustomRoom(socket.id, data.deck, data.charId, data.roomCode, user.id);
        });

        // 💡 [매칭 취소] 클라이언트가 대기 중 취소 버튼을 누를 때
        socket.on('CANCEL_MATCH', () => {
            roomManager.cancelMatch(socket.id);
            console.log(`[Socket] ${user.name} 매칭 취소 요청`);
        });

        socket.on('ACTION_SUBMIT', (actions) => roomManager.handleActionSubmit(socket.id, actions));
        socket.on('CARD_DISCARD', (data) => roomManager.handleCardDiscard(socket.id, data.cardInstanceId));
        socket.on('LEAVE_ROOM', () => roomManager.leaveRoom(socket.id));

        socket.on('disconnect', () => {
            // 💡 연결 끊김 시 중복 로그인 맵에서 해당 유저 제거
            if (userSocketMap.get(user.id) === socket.id) {
                userSocketMap.delete(user.id);
            }
            roomManager.leaveRoom(socket.id);
            console.log(`[Disconnected] ${user.name} (${socket.id})`);
        });
    });

    app.all('*', (req: any, res: any) => handle(req, res));

    httpServer.listen(PORT, () => {
        console.log(`🚀 Server on port ${PORT}`);
    });
});
