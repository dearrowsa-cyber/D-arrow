import crypto from 'crypto';
import type { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'darrow-admin-secret-key-2026';
export const ADMIN_AUTH_COOKIE = 'admin_token';

export function createToken(payload: object): string {
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
    const body = Buffer.from(JSON.stringify({
        ...payload,
        iat: Date.now(),
        exp: Date.now() + 24 * 60 * 60 * 1000,
    })).toString('base64url');
    const signature = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
    return `${header}.${body}.${signature}`;
}

export function verifyToken(token: string): boolean {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return false;

        const [header, body, signature] = parts;
        const expectedSignature = crypto.createHmac('sha256', JWT_SECRET)
            .update(`${header}.${body}`)
            .digest('base64url');
        if (signature !== expectedSignature) return false;

        const payload = JSON.parse(Buffer.from(body, 'base64url').toString());
        return typeof payload.exp === 'number' && payload.exp > Date.now();
    } catch {
        return false;
    }
}

export function getAdminToken(request: NextRequest): string | undefined {
    const cookieToken = request.cookies.get(ADMIN_AUTH_COOKIE)?.value;
    if (cookieToken) return cookieToken;

    const authorization = request.headers.get('authorization');
    return authorization?.replace(/^Bearer\s+/i, '') || undefined;
}

export function isAdminRequestAuthenticated(request: NextRequest): boolean {
    const token = getAdminToken(request);
    return Boolean(token && verifyToken(token));
}