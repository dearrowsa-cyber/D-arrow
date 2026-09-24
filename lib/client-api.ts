type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type RequestOptions = {
    endpoint: string;
    method: HttpMethod;
    params?: Record<string, unknown>;
    data?: unknown;
    isFormData?: boolean;
    cache?: RequestCache;
    revalidate?: number;
    token?: boolean | string;
};

export type ApiError = {
    status: number;
    message: string;
};

const BASE_URL = (
    process.env.BACKEND_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000"
).replace(/\/$/, "");

function getBaseUrl(): string {
    return BASE_URL;
}

/** Reads the admin token from client-side cookie */
function getAuthToken(): string | undefined {
    // Get token from document cookies
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'admin_token') {
            return value;
        }
    }
    return undefined;
}

async function request<T>({
    endpoint,
    method,
    params,
    data,
    isFormData = false,
    cache = "no-store",
    revalidate,
    token = false,
}: RequestOptions): Promise<T> {
    const url = new URL(endpoint, `${getBaseUrl()}/`);

    if (params) {
        for (const [key, value] of Object.entries(params)) {
            if (value !== null && value !== undefined && value !== "") {
                url.searchParams.set(key, String(value));
            }
        }
    }

    const headers = new Headers();
    if (!isFormData) {
        headers.set("Content-Type", "application/json");
    }

    if (token === true) {
        const authToken = getAuthToken();
        if (authToken) {
            headers.set("Authorization", `Bearer ${authToken}`);
        }
    } else if (typeof token === "string" && token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    const fetchOptions: RequestInit & { next?: { revalidate: number } } = {
        method,
        headers,
        body: data === undefined ? undefined : isFormData ? (data as BodyInit) : JSON.stringify(data),
        cache,
        next: revalidate === undefined ? undefined : { revalidate },
    };
    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
        const error: ApiError = {
            status: response.status,
            message: await response.text(),
        };
        throw error;
    }

    if (response.status === 204) {
        return undefined as T;
    }

    return response.json() as Promise<T>;
}

export const clientApi = {
    get: <T>(endpoint: string, options?: Omit<RequestOptions, "endpoint" | "method" | "data" | "isFormData">) =>
        request<T>({ endpoint, method: "GET", ...options }),

    post: <T>(endpoint: string, data?: unknown, options?: Pick<RequestOptions, "isFormData" | "token">) =>
        request<T>({ endpoint, method: "POST", data, ...options }),

    put: <T>(endpoint: string, data?: unknown, options?: Pick<RequestOptions, "token">) =>
        request<T>({ endpoint, method: "PUT", data, ...options }),

    patch: <T>(endpoint: string, data?: unknown, options?: Pick<RequestOptions, "token">) =>
        request<T>({ endpoint, method: "PATCH", data, ...options }),

    delete: <T>(endpoint: string, options?: Pick<RequestOptions, "token">) =>
        request<T>({ endpoint, method: "DELETE", ...options }),
};
