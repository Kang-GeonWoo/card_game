"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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

export default function RegisterPage() {
    const router = useRouter();

    // 폼 입력 상태
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // UI 피드백 상태
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        // 비밀번호 일치 여부 클라이언트 검증 (서버 호출 전 빠른 검증)
        if (password !== confirmPassword) {
            setError('비밀번호가 일치하지 않습니다. 다시 확인해 주세요.');
            return;
        }

        setIsLoading(true);

        try {
            // 회원가입 API 호출
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                // 서버에서 내려준 에러 메시지 표시
                setError(data.message || '회원가입에 실패했습니다.');
            } else {
                // 성공 시 안내 후 로그인 페이지로 이동
                setSuccess('회원가입 완료! 로그인 페이지로 이동합니다...');
                setTimeout(() => router.push('/login'), 1500);
            }
        } catch (err) {
            setError('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
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
                        새 계정 만들기
                    </Title>
                    <Text c="dimmed" size="sm" ta="center" mb="xl">
                        전장에 입장할 장수를 등록하세요
                    </Text>

                    {error && (
                        <Alert color="red" mb="md" radius="md" variant="filled">
                            {error}
                        </Alert>
                    )}
                    {success && (
                        <Alert color="teal" mb="md" radius="md" variant="filled">
                            {success}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <Stack gap="md">
                            <TextInput
                                label="닉네임"
                                placeholder="전장에서 불릴 이름"
                                value={name}
                                onChange={(e) => setName(e.currentTarget.value)}
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
                                placeholder="6자 이상 입력해 주세요"
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

                            <PasswordInput
                                label="비밀번호 확인"
                                placeholder="비밀번호를 한번 더 입력해 주세요"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.currentTarget.value)}
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
                                전장에 등록하기
                            </Button>
                        </Stack>
                    </form>

                    <Text ta="center" mt="xl" size="sm" c="dimmed">
                        이미 계정이 있으신가요?{' '}
                        <Anchor href="/login" c="violet.4" fw={700}>
                            로그인하기
                        </Anchor>
                    </Text>
                </Paper>
            </Container>
        </Box>
    );
}
