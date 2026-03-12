"use client";

import { SessionProvider } from 'next-auth/react';
import type { Session } from 'next-auth';

import { SocketProvider } from './SocketProvider';

interface ProvidersProps {
    children: React.ReactNode;
    // 서버에서 미리 가져온 세션을 클라이언트에 전달하여 깜빡임 현상 방지
    session?: Session | null;
}

// 앱 전체에 NextAuth 세션 상태를 공급하는 컴포넌트
export function Providers({ children, session }: ProvidersProps) {
    return (
        <SessionProvider session={session}>
            <SocketProvider>
                {children}
            </SocketProvider>
        </SessionProvider>
    );
}
