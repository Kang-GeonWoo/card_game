import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

// 1. DB 연결 주소 (안전하게 하드코딩 포함)
const connectionString = process.env.DATABASE_URL || "postgresql://admin:password@localhost:5435/cardgame?schema=public";

// 2. Postgres 연결 풀(Pool) 및 Prisma 어댑터 생성 (v7 필수 사항)
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// 3. PrismaClient에 어댑터를 장착하여 생성!
export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;