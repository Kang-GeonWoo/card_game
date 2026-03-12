import { NextRequest, NextResponse } from 'next/server';
// ✅ 정식 import 방식을 사용합니다.
import bcrypt from 'bcryptjs';
import prisma from '../../../../lib/prisma';

export async function POST(req: NextRequest) {
    try {
        console.log("가입 요청 받음!"); // 테스트용 로그

        const body = await req.json();
        const { email, password, name } = body;

        console.log("받은 데이터:", { email, name }); // 비밀번호는 로그에 찍지 않음

        if (!email || !password || !name) {
            return NextResponse.json({ message: '이메일, 비밀번호, 닉네임을 모두 입력해 주세요.' }, { status: 400 });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ message: '올바른 이메일 형식이 아닙니다.' }, { status: 400 });
        }

        if (password.length < 6) {
            return NextResponse.json({ message: '비밀번호는 최소 6자 이상이어야 합니다.' }, { status: 400 });
        }

        console.log("DB에서 유저 확인 중...");
        const existingUser = await prisma.user.findUnique({ where: { email } });

        if (existingUser) {
            return NextResponse.json({ message: '이미 사용 중인 이메일 주소입니다.' }, { status: 409 });
        }

        console.log("비밀번호 암호화 시작...");
        // 여기서 뻗는지 확인
        const hashedPassword = await bcrypt.hash(password, 12);
        console.log("비밀번호 암호화 완료!");

        console.log("새 유저 DB에 저장 중...");
        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name
            }
        });
        console.log("DB 저장 완료!");

        const { password: _pw, ...safeUser } = newUser;

        return NextResponse.json({ message: '회원가입이 완료되었습니다!', user: safeUser }, { status: 201 });

    } catch (error: any) {
        // 🔥 에러가 나면 터미널에 아주 자세히 출력하도록 변경
        console.error('[🚨 REGISTER API ERROR 상세 내역]:', error.message || error);
        return NextResponse.json({ message: '서버 오류가 발생했습니다.', error: error.message }, { status: 500 });
    }
}