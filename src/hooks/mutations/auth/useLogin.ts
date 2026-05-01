import { apiRequest } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

type LoginInput = {
    email: string;
    password: string;
};

type AuthResponse = {
    success: boolean;
    message: string;
};

export function useLogin() {
    return useMutation<AuthResponse, Error, LoginInput>({
        mutationFn: (data: LoginInput) =>
            apiRequest<AuthResponse, LoginInput>("/api/auth/login", {
                method: "POST",
                data,
            }),
    });
}
