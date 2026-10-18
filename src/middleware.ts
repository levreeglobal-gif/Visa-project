import { NextResponse, type NextRequest } from 'next/server';

/** First-line gate only (cookie presence). Authoritative session checks happen server-side in every admin page/action. */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const res = pathname.startsWith('/admin') && pathname !== '/admin/login' && !req.cookies.get('rv_admin_session')
    ? NextResponse.redirect(new URL('/admin/login', req.url))
    : NextResponse.next();
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/')) {
    res.headers.set('Cache-Control', 'no-store');
    res.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }
  return res;
}
export const config = { matcher: ['/admin/:path*', '/api/:path*'] };
