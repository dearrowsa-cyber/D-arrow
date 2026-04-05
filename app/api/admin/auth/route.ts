import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'DArrow@2026!';
const JWT_SECRET = process.env.JWT_SECRET || 'darrow-admin-secret-key-2026';

function createToken(payload: object): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify({ ...payload, iat: Date.now(), exp: Date.now() + 24 * 60 * 60 * 1000 })).toString('base64url');
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${signature}`;
}

export function verifyToken(token: string): boolean {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    const [header, body, signature] = parts;
    const expectedSig = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
    if (signature !== expectedSig) return false;
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString());
    return payload.exp > Date.now();
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ success: false, error: 'كلمة المرور غير صحيحة' }, { status: 401 });
    }

    const token = createToken({ role: 'admin' });
    
    return NextResponse.json({ success: true, token, message: 'تم تسجيل الدخول بنجاح' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'حدث خطأ في تسجيل الدخول' }, { status: 500 });
  }
}

// Verify token endpoint
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');
  
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ success: false, error: 'غير مصرح' }, { status: 401 });
  }

  return NextResponse.json({ success: true, message: 'Token valid' });
}
