// src/app/api/user/me/route.ts
// 로비에서 내 랭크 점수를 조회하는 API 엔드포인트
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/authOptions';
import prisma from '../../../../lib/prisma';

export async function GET() {
    // 세션 확인 - 미인증 시 401 반환
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // DB에서 rankScore만 선택적으로 조회 (최소한의 데이터만 가져옴)
    // 💡 prisma db push 후 타입 재생성 전까지 any 단언으로 안전하게 처리
    const user = await (prisma.user.findUnique as any)({
        where: { email: session.user.email },
        select: { rankScore: true }
    });

    return NextResponse.json(user);
}
