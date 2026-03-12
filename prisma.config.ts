import { defineConfig } from '@prisma/config';

// Prisma v7 공식 DB 연결 방식 - schema.prisma에서 url 제거되어 여기서 관리
export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL ?? "postgresql://admin:password@localhost:5435/cardgame?schema=public",
  },
});
