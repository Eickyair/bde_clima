import { PrismaClient } from '@prisma/client';
const LOG_LEVEL = process.env.PRISMA_LOG
globalThis.prisma = globalThis.prisma || new PrismaClient({
    log: [LOG_LEVEL]
});

export default globalThis.prisma;