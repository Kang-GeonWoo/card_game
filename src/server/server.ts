// src/server/server.ts
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { decode } from 'next-auth/jwt';
import * as dotenv from 'dotenv';
import path from 'path';
import next from 'next';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

const secret = process.env.NEXTAUTH_SECRET;
const PORT = process.env.PORT || 4000; // Render는 10000번 등의 포트를 주므로 동적 할당 필수

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

            (socket as any).user = decoded;
            next();
        } catch (error) {
            next(new Error('Authentication error'));
        }
    });

    // RoomManager 로딩
    const { RoomManager } = require('./RoomManager');
    const roomManager = new RoomManager(io);

    io.on('connection', (socket) => {
        const user = (socket as any).user;
        console.log(`[Socket Connected] User: ${user?.email}`);

        socket.on('MATCH_FIND', (data) => roomManager.joinMatchQueue(socket.id, data.deck, data.charId));
        socket.on('ACTION_SUBMIT', (actions) => roomManager.handleActionSubmit(socket.id, actions));
        socket.on('CARD_DISCARD', (data) => roomManager.handleCardDiscard(socket.id, data.cardInstanceId));
        socket.on('LEAVE_ROOM', () => roomManager.leaveRoom(socket.id));
        socket.on('disconnect', () => roomManager.leaveRoom(socket.id));
    });

    // Next.js 요청 처리 (프론트와 백엔드 통합 배포)
    app.all('*', (req, res) => handle(req, res));

    httpServer.listen(PORT, () => {
        console.log(`🚀 TCB Server running on port ${PORT}`);
    });
});
