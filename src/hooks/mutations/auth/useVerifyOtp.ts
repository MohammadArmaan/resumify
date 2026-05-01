import { apiRequest } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

type VerifyOtpInput = {
    email: string;
    otp: string;
}

type VerifyOtpResponse = {
    success: boolean;
    message: string;
}

export function useVerifyOtp() {
    return useMutation<VerifyOtpResponse, Error, VerifyOtpInput>({
        mutationFn: (data: VerifyOtpInput) => 
            apiRequest<VerifyOtpResponse, VerifyOtpInput>("/api/auth/verify-otp", {
                method: "POST",
                data
            })
    })
}