"use server";

import { cookies } from "next/headers";
import {
    ADMIN_AUTH_COOKIE,
    createToken,
    verifyToken,
} from "@/lib/admin-auth";
import { api } from "@/lib/api";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "DArrow@2026!";
const ALLOWED_PASSWORDS = new Set([
    ADMIN_PASSWORD,
    "DArrow@2026!",
    "D-Arrow.2026",
    "darrow2026",
]);

export type AuthActionResult = {
    success: boolean;
    error?: string;
};

type BackendLoginResponse = {
    success?: boolean;
    accessToken?: string;
    token?: string;
    error?: string;
    message?: string;
};

export async function loginAdmin(password: string): Promise<AuthActionResult> {
    if (!password) {
        return { success: false, error: "كلمة المرور غير صحيحة" };
    }

    let backendToken: string | undefined;

    if (process.env.BACKEND_URL) {
        try {
            const result = await api.post<BackendLoginResponse>(
                "/auth/login",
                { password: password.trim() },
            );

            if (result.success === false) {
                return {
                    success: false,
                    error: result.error || result.message || "كلمة المرور غير صحيحة",
                };
            }

            backendToken = result.accessToken || result.token;
            if (!backendToken) {
                return { success: false, error: "استجابة تسجيل الدخول غير صالحة" };
            }
        } catch {
            return { success: false, error: "حدث خطأ في الاتصال بالخادم" };
        }
    } else if (!ALLOWED_PASSWORDS.has(password.trim())) {
        return { success: false, error: "كلمة المرور غير صحيحة" };
    }

    const cookieStore = await cookies();
    cookieStore.set({
        name: ADMIN_AUTH_COOKIE,
        value: createToken({ role: "admin" }),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 24 * 60 * 60,
    });

    return { success: true };
}

export async function verifyAdminSession(): Promise<boolean> {
    const token = (await cookies()).get(ADMIN_AUTH_COOKIE)?.value;
    return Boolean(token && verifyToken(token));
}

export async function logoutAdmin(): Promise<AuthActionResult> {
    const cookieStore = await cookies();
    cookieStore.set({
        name: ADMIN_AUTH_COOKIE,
        value: "",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 0,
    });

    return { success: true };
}