"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    loginAdmin,
    logoutAdmin,
    verifyAdminSession,
} from "@/app/admin/actions";

export function useAdminAuth(shouldVerify = false) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isChecking, setIsChecking] = useState(shouldVerify);

    useEffect(() => {
        if (!shouldVerify) return;

        let active = true;
        setIsChecking(true);
        verifyAdminSession()
            .then((valid) => {
                if (active) setIsAuthenticated(valid);
            })
            .catch(() => {
                if (active) setIsAuthenticated(false);
            })
            .finally(() => {
                if (active) setIsChecking(false);
            });

        return () => {
            active = false;
        };
    }, [shouldVerify]);

    const login = useCallback(async (password: string) => {
        setLoading(true);
        setError("");

        try {
            const result = await loginAdmin(password);
            if (result.success) {
                window.location.href = "/admin";
                return true;
            }

            setError(result.error || "كلمة المرور غير صحيحة");
            return false;
        } catch {
            setError("حدث خطأ في الاتصال");
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const verify = useCallback(async () => {
        try {
            return await verifyAdminSession();
        } catch {
            return false;
        }
    }, []);

    const logout = useCallback(async () => {
        await logoutAdmin();
        router.push("/admin/login");
        router.refresh();
    }, [router]);

    return {
        error,
        isAuthenticated,
        isChecking,
        loading,
        login,
        logout,
        setError,
        verify,
    };
}