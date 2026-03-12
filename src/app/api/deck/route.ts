import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/authOptions';
import prisma from '../../../lib/prisma';

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { decks: { orderBy: { createdAt: 'desc' } } }
        });

        if (!user) {
            return NextResponse.json({ decks: [] }, { status: 200 });
        }

        return NextResponse.json({ decks: user.decks }, { status: 200 });
    } catch (error: any) {
        console.error('[GET /api/deck] Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
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

        const user = await prisma.user.findUnique({ where: { email: session.user.email } });
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const newDeck = await prisma.deck.create({
            data: {
                name,
                character,
                cards,
                userId: user.id
            }
        });

        return NextResponse.json({ message: 'Deck saved successfully', deck: newDeck }, { status: 201 });
    } catch (error: any) {
        console.error('[POST /api/deck] Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
