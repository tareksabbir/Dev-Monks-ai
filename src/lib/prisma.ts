/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from "../generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const connectionString = `${process.env.DATABASE_URL}`;

// Enable SSL only when the connection string requires it (e.g., Neon, Supabase)
// Local Docker Postgres does not use SSL
const useSSL = connectionString.includes("sslmode=require");

const pool = new pg.Pool({
  connectionString,
  ...(useSSL && {
    ssl: {
      rejectUnauthorized: false,
    },
  }),
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

const adapter = new PrismaPg(pool as any);

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
  } as any);

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
