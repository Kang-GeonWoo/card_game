import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import prisma from './prisma';

export const authOptions: NextAuthOptions = {
    session: { strategy: 'jwt' },
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: { email: { label: '이메일', type: 'email' }, password: { label: '비밀번호', type: 'password' } },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) throw new Error('이메일과 비밀번호를 입력해 주세요.');
                const user = await prisma.user.findUnique({ where: { email: credentials.email } });
                if (!user) throw new Error('가입되지 않은 이메일 주소입니다.');
                const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
                if (!isPasswordValid) throw new Error('비밀번호가 일치하지 않습니다.');
                return { id: user.id, email: user.email, name: user.name };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) { 
            if (user) token.id = user.id; 
            return token; 
        },
        async session({ session, token }) { 
            if (session.user) (session.user as any).id = token.id; 
            return session; 
        },
    },
    pages: { signIn: '/login', error: '/login' },
};
