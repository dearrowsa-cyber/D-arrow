import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_AUTH_COOKIE, createToken, verifyToken } from '@/lib/admin-auth';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'DArrow@2026!';
const ALLOWED_PASSWORDS = new Set([
  ADMIN_PASSWORD,
  'DArrow@2026!',
  'D-Arrow.2026',
  'darrow2026',
]);

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();

    if (!password || !ALLOWED_PASSWORDS.has(password.trim())) {
      return NextResponse.json({ success: false, error: 'كلمة المرور غير صحيحة' }, { status: 401 });
    }

    const token = createToken({ role: 'admin' });
    const response = NextResponse.json({ success: true, message: 'تم تسجيل الدخول بنجاح' });
    response.cookies.set({
      name: ADMIN_AUTH_COOKIE,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 24 * 60 * 60,
    });
    return response;
  } catch (error) {
    return NextResponse.json({ success: false, error: 'حدث خطأ في تسجيل الدخول' }, { status: 500 });
  }
}

// Verify token endpoint
export async function GET(req: NextRequest) {
  const token = req.cookies.get(ADMIN_AUTH_COOKIE)?.value
    || req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');

  if (!token || !verifyToken(token)) {
    return NextResponse.json({ success: false, error: 'غير مصرح' }, { status: 401 });
  }

  return NextResponse.json({ success: true, message: 'Token valid' });
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: ADMIN_AUTH_COOKIE,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
  });
  return response;
}
