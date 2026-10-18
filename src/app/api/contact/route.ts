import { NextResponse } from 'next/server';
import { validateContact } from '@/lib/security/validation';
import { dbConfigured } from '@/lib/server/db';
import { hashBucket, ipHash, sameOrigin } from '@/lib/server/request';
import * as rate from '@/lib/server/ratelimit';
import { createEnquiry, setDelivery } from '@/lib/server/enquiries';
import { contactRecipient } from '@/lib/server/cms';
import { sendEnquiryEmail } from '@/lib/server/mailer';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const json = (body: Record<string, unknown>, status = 200) => NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });

export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ success: false, error: 'Request blocked.' }, 403);
  if (!request.headers.get('content-type')?.toLowerCase().includes('application/json')) return json({ success: false, error: 'Expected a JSON request.' }, 415);
  const length = Number(request.headers.get('content-length') || 0);
  if (Number.isFinite(length) && length > 20000) return json({ success: false, error: 'Request too large.' }, 413);
  // Enforce the limit while reading too: Content-Length can be absent for streamed/chunked requests.
  let body: unknown;
  try {
    const reader = request.body?.getReader();
    if (!reader) return json({ success: false, error: 'Invalid request body.' }, 400);
    const chunks: Uint8Array[] = []; let total = 0;
    while (true) {
      const part = await reader.read();
      if (part.done) break;
      total += part.value.byteLength;
      if (total > 20000) { await reader.cancel(); return json({ success: false, error: 'Request too large.' }, 413); }
      chunks.push(part.value);
    }
    const bytes = new Uint8Array(total); let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
    body = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
  } catch { return json({ success: false, error: 'Invalid request body.' }, 400); }

  const parsed = validateContact(body);
  if (!parsed.ok) return json({ success: false, error: parsed.error }, 400);
  const v = parsed.value;
  if (v.honeypot) return json({ success: true, saved: true, notified: false, message: 'Thank you. Your message has been received.' }); // bots: pretend, store nothing

  if (!dbConfigured()) return json({ success: false, error: 'We cannot save your enquiry right now. Please use the phone or WhatsApp options.' }, 503);
  try {
    const bucket = hashBucket(`contact:${await ipHash()}`);
    const max = process.env.TRUST_PROXY === 'true' ? 5 : 60; // without a trusted proxy all visitors share one bucket
    if (await rate.tooMany(bucket, 'contact', max, 900)) return json({ success: false, error: 'Too many attempts. Please try again later.' }, 429);
    await rate.record(bucket, 'contact');

    const id = await createEnquiry(v, await ipHash()); // 1) persist first
    let notified = false;
    try { // 2) then attempt email; any failure leaves the stored enquiry intact
      const outcome = await sendEnquiryEmail({ id, ...v }, await contactRecipient());
      await setDelivery(id, outcome.status, outcome.detail);
      notified = outcome.status === 'sent';
    } catch { try { await setDelivery(id, 'failed', 'Unexpected error while sending notification.'); } catch { /* enquiry is still saved */ } }
    return json({
      success: true, saved: true, notified,
      message: notified ? 'Thank you. Your enquiry has been received and our team has been notified.' : 'Thank you. Your enquiry has been received and saved. Our team will review it; for urgent matters please call or WhatsApp us.',
    });
  } catch (error) {
    console.error('Roopo Visa enquiry save failed:', error instanceof Error ? error.name : 'unknown');
    return json({ success: false, error: 'We could not save your enquiry right now. Please use the phone or WhatsApp options.' }, 503);
  }
}
