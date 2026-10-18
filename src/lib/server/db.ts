import mysql, { type Pool, type RowDataPacket, type ResultSetHeader } from 'mysql2/promise';

const g = globalThis as unknown as { __rvPool?: Pool };

export function dbConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL || (process.env.DB_HOST && process.env.DB_NAME && process.env.DB_USER));
}

/** mysql2 PoolOptions does not use a generic `uri` property; parse DATABASE_URL explicitly. */
function parseDatabaseUrl(raw: string) {
  const u = new URL(raw);
  if (u.protocol !== 'mysql:' && u.protocol !== 'mariadb:') throw new Error('DATABASE_URL must use mysql:// or mariadb://.');
  const database = decodeURIComponent(u.pathname.replace(/^\//, ''));
  if (!u.hostname || !database || !u.username) throw new Error('DATABASE_URL must include host, database and username.');
  return {
    waitForConnections: true, connectionLimit: 5, charset: 'utf8mb4', timezone: 'Z', dateStrings: false, connectTimeout: 8000,
    host: u.hostname,
    port: u.port ? Number(u.port) : 3306,
    user: decodeURIComponent(u.username),
    password: decodeURIComponent(u.password),
    database,
  };
}

export function pool(): Pool {
  if (g.__rvPool) return g.__rvPool;
  if (!dbConfigured()) throw new Error('Database is not configured (set DATABASE_URL or DB_HOST/DB_NAME/DB_USER/DB_PASSWORD).');
  const common = { waitForConnections: true, connectionLimit: 5, charset: 'utf8mb4', timezone: 'Z', dateStrings: false, connectTimeout: 8000 } as const;
  g.__rvPool = process.env.DATABASE_URL
    ? mysql.createPool(parseDatabaseUrl(process.env.DATABASE_URL))
    : mysql.createPool({ host: process.env.DB_HOST, port: Number(process.env.DB_PORT || 3306), database: process.env.DB_NAME, user: process.env.DB_USER, password: process.env.DB_PASSWORD, ...common });
  return g.__rvPool;
}
/** Always parameterised: values are never interpolated into SQL text. */
export async function query<T extends RowDataPacket>(sql: string, params: unknown[] = []): Promise<T[]> {
  const [rows] = await pool().execute<T[]>(sql, params as never[]);
  return rows;
}
export async function exec(sql: string, params: unknown[] = []): Promise<ResultSetHeader> {
  const [res] = await pool().execute<ResultSetHeader>(sql, params as never[]);
  return res;
}
export type { RowDataPacket };
