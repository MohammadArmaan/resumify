import { apiRequest } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

type ForgotPasswordInput = {
    email: string;
};

type ForgotPasswordResponse = {
    success: boolean;
    message: string;
};

export function useForgotPassword() {
    return useMutation<ForgotPasswordResponse, Error,ForgotPasswordInput>({
        mutationFn: (data: ForgotPasswordInput) =>
            apiRequest<ForgotPasswordResponse, ForgotPasswordInput>(
                "/api/auth/forgot-password",
                {
                    method: "POST",
                    data,
                },
            ),
    });
}
