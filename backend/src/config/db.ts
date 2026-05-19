import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { pool } from './database';

declare global {
  var prisma: PrismaClient | undefined;
}

const prismaClientSingleton = () => {
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
};

const prisma = global.prisma || prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;


