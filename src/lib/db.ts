import { Pool, types } from "pg";

// Return date/timestamp/timestamptz as raw strings instead of JS Date objects.
// Keeps row types honest (lib/types.ts declares these as string) and avoids
// Date-serialization surprises across the RSC server/client boundary.
// 1082 = date, 1114 = timestamp, 1184 = timestamptz.
types.setTypeParser(1082, (v) => v);
types.setTypeParser(1114, (v) => v);
types.setTypeParser(1184, (v) => v);

declare global {
  var __pgPool: Pool | undefined;
}

export const pool: Pool =
  global.__pgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30_000,
  });

if (process.env.NODE_ENV !== "production") {
  global.__pgPool = pool;
}

export async function query<T = unknown>(sql: string, params?: unknown[]): Promise<T[]> {
  const { rows } = await pool.query(sql, params);
  return rows as T[];
}

export async function queryOne<T = unknown>(sql: string, params?: unknown[]): Promise<T | null> {
  const { rows } = await pool.query(sql, params);
  return (rows[0] as T) ?? null;
}
