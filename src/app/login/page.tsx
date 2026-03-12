"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import {
    Container,
    Paper,
    Title,
    Text,
    TextInput,
    PasswordInput,
    Button,
    Anchor,
    Stack,
    Alert,
    Center,
    Box,
} from '@mantine/core';

export default function LoginPage() {
    const router = useRouter();

    // 폼 입력 상태
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // UI 피드백 상태
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            // NextAuth의 signIn 함수를 통해 Credentials 방식으로 로그인 시도
            // redirect: false -> 로그인 결과를 직접 받아서 수동으로 처리
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                // 서버(authorize 함수)에서 던진 에러 메시지를 표시
                setError(result.error);
            } else if (result?.ok) {
                // 로그인 성공 시 로비(/)로 이동
                router.push('/');
                router.refresh(); // Next.js 캐시 갱신으로 세션 상태가 즉시 반영되도록 함
            }
        } catch (err) {
            setError('로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box
            style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #0d0d1a 0%, #1a1a2e 50%, #16213e 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Container size={460} w="100%">
                <Center mb={40}>
                    <Stack align="center" gap={4}>
                        <Text
                            size="42px"
                            fw={900}
                            style={{
                                background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                letterSpacing: '3px',
                                fontFamily: 'Georgia, serif',
                            }}
                        >
                            ⚔️ TCB
                        </Text>
                        <Text c="dimmed" size="sm" ta="center">
                            Turn-based Card Battle
                        </Text>
                    </Stack>
                </Center>

                <Paper
                    radius="md"
                    p="xl"
                    withBorder
                    style={{
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(124, 58, 237, 0.3)',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
                    }}
                >
                    <Title order={2} ta="center" mb={4} c="white">
                        전장에 귀환하라
                    </Title>
                    <Text c="dimmed" size="sm" ta="center" mb="xl">
                        당신의 계정으로 로그인하세요
                    </Text>

                    {error && (
                        <Alert color="red" mb="md" radius="md" variant="filled">
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <Stack gap="md">
                            <TextInput
                                label="이메일"
                                placeholder="your@email.com"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.currentTarget.value)}
                                required
                                styles={{
                                    label: { color: '#c1c2c5' },
                                    input: {
                                        background: 'rgba(255,255,255,0.05)',
                                        borderColor: 'rgba(124, 58, 237, 0.3)',
                                        color: 'white',
                                    },
                                }}
                            />

                            <PasswordInput
                                label="비밀번호"
                                placeholder="비밀번호를 입력해 주세요"
                                value={password}
                                onChange={(e) => setPassword(e.currentTarget.value)}
                                required
                                styles={{
                                    label: { color: '#c1c2c5' },
                                    input: {
                                        background: 'rgba(255,255,255,0.05)',
                                        borderColor: 'rgba(124, 58, 237, 0.3)',
                                    },
                                    innerInput: { color: 'white' },
                                }}
                            />

                            <Button
                                type="submit"
                                fullWidth
                                size="md"
                                mt="sm"
                                loading={isLoading}
                                style={{
                                    background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                                    border: 'none',
                                    fontWeight: 700,
                                    letterSpacing: '1px',
                                }}
                            >
                                전장 입장
                            </Button>
                        </Stack>
                    </form>

                    <Text ta="center" mt="xl" size="sm" c="dimmed">
                        아직 계정이 없으신가요?{' '}
                        <Anchor href="/register" c="violet.4" fw={700}>
                            회원가입하기
                        </Anchor>
                    </Text>
                </Paper>
            </Container>
        </Box>
    );
}
