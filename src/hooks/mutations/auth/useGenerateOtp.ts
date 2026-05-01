import { apiRequest } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

type GenerateOtpInput = {
    email: string;
};

type GenerateOtpResponse = {
    success: boolean;
    message: string;
};

export function useGenerateOtp() {
    return useMutation<GenerateOtpResponse, Error, GenerateOtpInput>({
        mutationFn: (data: GenerateOtpInput) =>
            apiRequest<GenerateOtpResponse, GenerateOtpInput>(
                "/api/auth/generate-otp",
                {
                    method: "POST",
                    data,
                },
            ),
    });
}
