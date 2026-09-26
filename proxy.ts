import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isAdminRequestAuthenticated } from '@/lib/admin-auth';

// Subdomain reserved for the real-estate demo (override with env var).
const RE_SUBDOMAIN = process.env.RE_SUBDOMAIN || 'realestate';
const RE_MOUNT_PATH = '/demo/real-estate';

export async function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();

  const normalizedPath = url.pathname.replace(/\/+$/, '') || '/';

  const isAdminPage = normalizedPath.startsWith('/admin') && normalizedPath !== '/admin/login';
  const isAdminApi = normalizedPath.startsWith('/api/admin') && normalizedPath !== '/api/admin/auth';
  if ((isAdminPage || isAdminApi) && !isAdminRequestAuthenticated(request)) {
    if (isAdminApi) {
      return NextResponse.json({ success: false, error: 'غير مصرح' }, { status: 401 });
    }
    url.pathname = '/admin/login';
    return NextResponse.redirect(url);
  }

  const hostname = (request.headers.get('host') ?? '').split(':')[0].toLowerCase();
  const hostParts = hostname.split('.');

  // Skip static assets, _next and direct APIs
  if (
    url.pathname.startsWith('/_next') ||
    (url.pathname.startsWith('/api') && !isAdminApi) ||
    url.pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // --- 1. Sara Subdomain (sara.d-arrow.com / sara.localhost) ---
  const isSaraSubdomain =
    (hostParts.length >= 2 && hostParts[0] === 'sara' && !hostname.startsWith('www.')) ||
    hostname.startsWith('sara.');

  if (isSaraSubdomain) {
    if (url.pathname === '/' || url.pathname === '') {
      url.pathname = '/sara';
      return NextResponse.rewrite(url);
    }
    return NextResponse.next();
  }

  // --- 2. Real-estate demo subdomain ---
  const isReSubdomain =
    (hostParts.length >= 2 && hostParts[0] === RE_SUBDOMAIN && !hostname.startsWith('www.')) ||
    hostname.startsWith('realestate.');

  if (isReSubdomain) {
    let path = url.pathname;
    if (path.startsWith(RE_MOUNT_PATH)) {
      path = path.slice(RE_MOUNT_PATH.length) || '/';
    }
    url.pathname = path === '/' ? RE_MOUNT_PATH : `${RE_MOUNT_PATH}${path}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
