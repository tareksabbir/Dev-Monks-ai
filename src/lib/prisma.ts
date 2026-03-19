/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from "../generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const connectionString = `${process.env.DATABASE_URL}`;

const pool = new pg.Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false, // Required for some hosted PostgreSQL providers like Neon
  },
  max: 20, // Adjust pool size as needed
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000, // Important for hibernation wake-up
});

const adapter = new PrismaPg(pool as any);

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
  } as any);

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
