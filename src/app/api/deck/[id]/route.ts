import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/authOptions';
import prisma from '../../../../lib/prisma';

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    // Next.js 15부터 params가 Promise로 변경되어 await이 필수
    const { id } = await params;
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { name, character, cards } = body;

        if (!name || !character || !cards || !Array.isArray(cards)) {
            return NextResponse.json({ message: 'Invalid data format' }, { status: 400 });
        }

        // 덱 소유자 확인
        const existingDeck = await prisma.deck.findUnique({
            where: { id },
            include: { user: true }
        });

        if (!existingDeck) {
            return NextResponse.json({ message: 'Deck not found' }, { status: 404 });
        }

        if (existingDeck.user.email !== session.user.email) {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        }

        const updatedDeck = await prisma.deck.update({
            where: { id },
            data: { name, character, cards }
        });

        return NextResponse.json({ message: 'Deck updated successfully', deck: updatedDeck }, { status: 200 });
    } catch (error: any) {
        console.error('[PUT /api/deck/[id]] Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    // Next.js 15부터 params가 Promise로 변경되어 await이 필수
    const { id } = await params;
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const existingDeck = await prisma.deck.findUnique({
            where: { id },
            include: { user: true }
        });

        if (!existingDeck) {
            return NextResponse.json({ message: 'Deck not found' }, { status: 404 });
        }

        if (existingDeck.user.email !== session.user.email) {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        }

        await prisma.deck.delete({
            where: { id }
        });

        return NextResponse.json({ message: 'Deck deleted successfully' }, { status: 200 });
    } catch (error: any) {
        console.error('[DELETE /api/deck/[id]] Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
