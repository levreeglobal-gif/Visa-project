import { exec, query, type RowDataPacket } from './db';

export const STATUSES = ['new', 'in_progress', 'replied', 'closed'] as const;
export type Status = (typeof STATUSES)[number];
export const STATUS_LABEL: Record<Status, string> = { new: 'New', in_progress: 'In Progress', replied: 'Replied', closed: 'Closed' };
export type Delivery = 'pending' | 'sent' | 'failed' | 'not_configured';
export const DELIVERY_LABEL: Record<Delivery, string> = { pending: 'Pending', sent: 'Email sent', failed: 'Email failed', not_configured: 'Email not configured' };

export type Enquiry = { id: number; name: string; email: string; phone: string; service: string; message: string; status: Status; delivery: Delivery; deliveryDetail: string | null; createdAt: Date; updatedAt: Date };
type Row = RowDataPacket & { id: number; name: string; email: string; phone: string; service: string; message: string; status: Status; delivery_status: Delivery; delivery_detail: string | null; created_at: Date; updated_at: Date };
const map = (r: Row): Enquiry => ({ id: Number(r.id), name: r.name, email: r.email, phone: r.phone, service: r.service, message: r.message, status: r.status, delivery: r.delivery_status, deliveryDetail: r.delivery_detail, createdAt: r.created_at, updatedAt: r.updated_at });

export async function createEnquiry(v: { name: string; email: string; phone: string; service: string; message: string }, ipHash: string): Promise<number> {
  const res = await exec('INSERT INTO enquiries (name, email, phone, service, message, ip_hash) VALUES (?, ?, ?, ?, ?, ?)', [v.name, v.email, v.phone, v.service, v.message, ipHash]);
  return res.insertId;
}
export async function setDelivery(id: number, status: Delivery, detail: string | null): Promise<void> {
  await exec('UPDATE enquiries SET delivery_status = ?, delivery_detail = ? WHERE id = ?', [status, detail ? detail.slice(0, 255) : null, id]);
}
export type ListFilter = { q?: string; status?: string; delivery?: string; page?: number };
export const PAGE_SIZE = 20;
export async function listEnquiries(f: ListFilter): Promise<{ rows: Enquiry[]; total: number; page: number }> {
  const where: string[] = []; const params: unknown[] = [];
  if (f.status && (STATUSES as readonly string[]).includes(f.status)) { where.push('status = ?'); params.push(f.status); }
  if (f.delivery && ['pending', 'sent', 'failed', 'not_configured'].includes(f.delivery)) { where.push('delivery_status = ?'); params.push(f.delivery); }
  const q = (f.q || '').trim().slice(0, 100);
  if (q) { const like = `%${q.replace(/[\\%_]/g, (m) => `\\${m}`)}%`; where.push('(name LIKE ? OR email LIKE ? OR phone LIKE ? OR message LIKE ?)'); params.push(like, like, like, like); }
  const w = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const page = Math.max(1, Math.min(Number(f.page) || 1, 100000));
  const total = Number((await query<RowDataPacket & { c: number }>(`SELECT COUNT(*) AS c FROM enquiries ${w}`, params))[0]?.c ?? 0);
  const rows = await query<Row>(`SELECT * FROM enquiries ${w} ORDER BY created_at DESC, id DESC LIMIT ${PAGE_SIZE} OFFSET ${(page - 1) * PAGE_SIZE}`, params);
  return { rows: rows.map(map), total, page };
}
export async function getEnquiry(id: number): Promise<Enquiry | null> {
  if (!Number.isSafeInteger(id) || id < 1) return null;
  const r = (await query<Row>('SELECT * FROM enquiries WHERE id = ? LIMIT 1', [id]))[0];
  return r ? map(r) : null;
}
export async function updateStatus(id: number, status: string): Promise<boolean> {
  if (!(STATUSES as readonly string[]).includes(status)) return false;
  return (await exec('UPDATE enquiries SET status = ? WHERE id = ?', [status, id])).affectedRows > 0;
}
export type Note = { id: number; note: string; createdAt: Date; author: string | null };
export async function listNotes(enquiryId: number): Promise<Note[]> {
  const rows = await query<RowDataPacket & { id: number; note: string; created_at: Date; display_name: string | null }>(
    'SELECT n.id, n.note, n.created_at, u.display_name FROM enquiry_notes n LEFT JOIN admin_users u ON u.id = n.admin_id WHERE n.enquiry_id = ? ORDER BY n.created_at DESC, n.id DESC', [enquiryId]);
  return rows.map((r) => ({ id: Number(r.id), note: r.note, createdAt: r.created_at, author: r.display_name }));
}
export async function addNote(enquiryId: number, adminId: number, note: string): Promise<void> {
  await exec('INSERT INTO enquiry_notes (enquiry_id, admin_id, note) VALUES (?, ?, ?)', [enquiryId, adminId, note]);
}
export async function deleteEnquiry(id: number): Promise<void> { await exec('DELETE FROM enquiries WHERE id = ?', [id]); }
export async function counts(): Promise<{ byStatus: Record<Status, number>; total: number; failedDelivery: number; last7: number; recent: Enquiry[] }> {
  const by = await query<RowDataPacket & { status: Status; c: number }>('SELECT status, COUNT(*) AS c FROM enquiries GROUP BY status');
  const byStatus = { new: 0, in_progress: 0, replied: 0, closed: 0 } as Record<Status, number>;
  for (const r of by) byStatus[r.status] = Number(r.c);
  const failed = Number((await query<RowDataPacket & { c: number }>("SELECT COUNT(*) AS c FROM enquiries WHERE delivery_status IN ('failed','not_configured')"))[0]?.c ?? 0);
  const last7 = Number((await query<RowDataPacket & { c: number }>('SELECT COUNT(*) AS c FROM enquiries WHERE created_at > (UTC_TIMESTAMP() - INTERVAL 7 DAY)'))[0]?.c ?? 0);
  const recent = (await query<Row>('SELECT * FROM enquiries ORDER BY created_at DESC, id DESC LIMIT 5')).map(map);
  return { byStatus, total: Object.values(byStatus).reduce((a, b) => a + b, 0), failedDelivery: failed, last7, recent };
}
