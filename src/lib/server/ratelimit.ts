import { exec, query, type RowDataPacket } from './db';

/** DB-backed sliding window; survives restarts and works across Passenger workers. */
export async function tooMany(bucket: string, kind: string, max: number, windowSeconds: number): Promise<boolean> {
  const rows = await query<RowDataPacket & { c: number }>(
    'SELECT COUNT(*) AS c FROM rate_events WHERE bucket = ? AND kind = ? AND created_at > (UTC_TIMESTAMP() - INTERVAL ? SECOND)',
    [bucket, kind, windowSeconds],
  );
  return Number(rows[0]?.c ?? 0) >= max;
}
export async function record(bucket: string, kind: string): Promise<void> {
  await exec('INSERT INTO rate_events (bucket, kind, created_at) VALUES (?, ?, UTC_TIMESTAMP())', [bucket, kind]);
  if (Math.random() < 0.02) await exec('DELETE FROM rate_events WHERE created_at < (UTC_TIMESTAMP() - INTERVAL 2 DAY)');
}
export async function clear(bucket: string, kind: string): Promise<void> {
  await exec('DELETE FROM rate_events WHERE bucket = ? AND kind = ?', [bucket, kind]);
}
