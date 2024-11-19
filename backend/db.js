import { PrismaClient } from '@prisma/client';

globalThis.prisma = globalThis.prisma || new PrismaClient({
    log: ['query', 'info', 'warn', 'error']
});

export default globalThis.prisma;