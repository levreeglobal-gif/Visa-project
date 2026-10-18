import nodemailer from 'nodemailer';
import { escapeHtml, safeHeaderText } from '@/lib/security/validation';

export function smtpStatus(): { configured: boolean; missing: string[]; host: string; port: number; secure: boolean; fromSet: boolean } {
  const need: [string, string | undefined][] = [['SMTP_HOST', process.env.SMTP_HOST], ['SMTP_USER', process.env.SMTP_USER], ['SMTP_PASSWORD', process.env.SMTP_PASSWORD]];
  const missing = need.filter(([, v]) => !v || !v.trim()).map(([k]) => k);
  return { configured: missing.length === 0, missing, host: (process.env.SMTP_HOST || '').trim(), port: Number(process.env.SMTP_PORT || 587), secure: process.env.SMTP_SECURE === 'true', fromSet: Boolean(process.env.SMTP_FROM?.trim()) };
}
export type SendOutcome = { status: 'sent' | 'failed' | 'not_configured'; detail: string };
type Mail = { id: number; name: string; email: string; phone: string; service: string; message: string };

export async function sendEnquiryEmail(m: Mail, recipient: string): Promise<SendOutcome> {
  const st = smtpStatus();
  if (!recipient) return { status: 'not_configured', detail: 'No notification recipient configured.' };
  if (!st.configured) return { status: 'not_configured', detail: `SMTP not configured (missing: ${st.missing.join(', ')}).` };
  try {
    const user = process.env.SMTP_USER!.trim();
    const transporter = nodemailer.createTransport({
      host: st.host, port: st.port, secure: st.secure, auth: { user, pass: process.env.SMTP_PASSWORD! },
      connectionTimeout: 10000, greetingTimeout: 10000, socketTimeout: 15000,
    });
    await transporter.sendMail({
      from: process.env.SMTP_FROM?.trim() || user, to: recipient, replyTo: m.email,
      subject: `Roopo Visa enquiry #${m.id} — ${safeHeaderText(m.name)}`,
      text: `Name: ${m.name}\nEmail: ${m.email}\nPhone: ${m.phone || 'Not provided'}\nService: ${m.service || 'Not selected'}\n\n${m.message}`,
      html: `<h2>New Roopo Visa enquiry #${m.id}</h2><p><b>Name:</b> ${escapeHtml(m.name)}</p><p><b>Email:</b> ${escapeHtml(m.email)}</p><p><b>Phone:</b> ${escapeHtml(m.phone || 'Not provided')}</p><p><b>Service:</b> ${escapeHtml(m.service || 'Not selected')}</p><p><b>Message:</b><br>${escapeHtml(m.message).replace(/\n/g, '<br>')}</p>`,
    });
    return { status: 'sent', detail: 'Notification email accepted by SMTP server.' };
  } catch (e) {
    const code = (e as { code?: string })?.code;
    return { status: 'failed', detail: `SMTP error${code ? ` (${code})` : ''}. Check SMTP settings.` }; // never include credentials or raw server text
  }
}
