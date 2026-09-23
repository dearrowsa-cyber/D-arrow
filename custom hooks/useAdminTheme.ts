"use client";

import { useState } from "react";

type AdminTheme = "dark" | "light";

export function useAdminTheme() {
    const [theme, setTheme] = useState<AdminTheme>(() => {
        if (typeof window === "undefined") return "dark";
        return window.localStorage.getItem("admin_theme") === "light" ? "light" : "dark";
    });

    const toggleTheme = () => {
        const nextTheme = theme === "dark" ? "light" : "dark";
        setTheme(nextTheme);
        localStorage.setItem("admin_theme", nextTheme);
    };

    return { theme, toggleTheme };
}