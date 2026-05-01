// lib/api.ts
import axios, { AxiosError, AxiosRequestConfig } from "axios";

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// 🔥 Generic API function
export async function apiRequest<TResponse, TData = unknown>(
    url: string,
    options?: AxiosRequestConfig<TData>,
): Promise<TResponse> {
    try {
        const res = await api.request<TResponse>({
            url,
            ...options,
        });

        return res.data;
    } catch (error) {
        const err = error as AxiosError<{ message?: string }>;

        throw new Error(err.response?.data?.message || "Something went wrong");
    }
}
