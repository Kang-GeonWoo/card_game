// src/components/SocketProvider.tsx
"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { useSession } from 'next-auth/react';

const SocketContext = createContext<Socket | null>(null);
export const useSocket = () => useContext(SocketContext);

export function SocketProvider({ children }: { children: React.ReactNode }) {
    const { status } = useSession();
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        if (status === 'authenticated' && !socket) {
            // 배포 시에는 NEXT_PUBLIC_SOCKET_URL을 비워두면 자동으로 같은 도메인을 바라봅니다.
            const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL || window.location.origin, {
                withCredentials: true,
                transports: ['websocket'],
                reconnection: true,
            });

            socketInstance.on('connect', () => console.log('[Socket] Connected.'));
            setSocket(socketInstance);

            return () => { socketInstance.disconnect(); };
        }
    }, [status]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
}
