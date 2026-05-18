import { PrismaClient } from '@prisma/client';

/**
 * Prisma Client configuration file.
 * Creates a singleton instance of the PrismaClient to be reused across the application
 * ensuring we don't exhaust the database connection limit.
 */

// Define global interface to store the prisma instance across hot-reloads
declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;
