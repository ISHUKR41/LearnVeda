import { PrismaClient } from '@prisma/client';
/**
 * Prisma Client configuration file.
 * Creates a singleton instance of the PrismaClient to be reused across the application
 * ensuring we don't exhaust the database connection limit.
 */
declare global {
    var prisma: PrismaClient | undefined;
}
declare const prisma: PrismaClient<import(".prisma/client").Prisma.PrismaClientOptions, never, import("@prisma/client/runtime/client").DefaultArgs>;
export default prisma;
//# sourceMappingURL=db.d.ts.map