'use client';

import { useState, type FormEvent } from 'react';

export default function ContactForm() {
  const [state, setState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState('sending');
    setMessage('');
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get('name') || ''),
      email: String(data.get('email') || ''),
      phone: String(data.get('phone') || ''),
      service: String(data.get('service') || ''),
      message: String(data.get('message') || ''),
      website: String(data.get('website') || ''),
    };
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error || 'Your enquiry could not be saved. Please use a phone or WhatsApp option.');
      setState('success');
      setMessage(typeof result.message === 'string' ? result.message : 'Thank you. Your enquiry has been received.');
      form.reset();
    } catch (error) {
      setState('error');
      setMessage(error instanceof Error ? error.message : 'Unable to send right now. Please contact us by phone or WhatsApp.');
    }
  }
  return (
    <form className="contact-form" onSubmit={submit}>
      <div className="form-row">
        <label>Your name<input name="name" autoComplete="name" required minLength={2} maxLength={100} placeholder="Name / নাম" /></label>
        <label>Email address<input name="email" type="email" autoComplete="email" required maxLength={254} placeholder="you@example.com" /></label>
      </div>
      <div className="form-row">
        <label>Phone / WhatsApp <span className="optional">Optional</span><input name="phone" type="tel" autoComplete="tel" maxLength={40} placeholder="+880…" /></label>
        <label>What do you need help with?
          <select name="service" defaultValue="">
            <option value="">Select a service</option>
            <option>IVAC appointment support</option><option>VFS Global appointment support</option><option>Korean tourist visa</option><option>Korean scholarship student visa</option><option>Korean business visa</option><option>GVCW appointment support</option><option>Indian medical travel</option><option>Other visa support</option>
          </select>
        </label>
      </div>
      <label>How can we help?<textarea name="message" required minLength={10} maxLength={4000} rows={5} placeholder="Tell us briefly what support you need." /></label>
      <div className="honeypot" aria-hidden="true"><label>Leave this field empty<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <button className="button" type="submit" disabled={state === 'sending'}>{state === 'sending' ? 'Sending…' : 'Send enquiry'} <span aria-hidden="true">↗</span></button>
      <p className={`form-status ${state}`} role="status" aria-live="polite">{message}</p>
      <p className="form-privacy">By submitting, you agree that we may use these details to respond to your enquiry. Please do not include passport numbers or other sensitive documents in this form.</p>
    </form>
  );
}
