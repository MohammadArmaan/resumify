import { apiRequest } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

type ResetPasswordInput = {
    token: string;
    password: string;
}

type ResetPasswordResponse = {
    success: boolean;
    message: string;
}

export function useResetPassword() {
    return useMutation<ResetPasswordResponse, Error, ResetPasswordInput>({
        mutationFn: (data: ResetPasswordInput) =>
            apiRequest<ResetPasswordResponse, ResetPasswordInput>("api/auth/reset-password", {
                method: "POST",
                data
            })
    })
}