import { apiRequest } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

type GoogleLoginInput = {
    token: string;
}

type GoogleLoginResponse = {
    success: boolean;
    message: string;
}

export function useGoogleLogin() {
    return useMutation<GoogleLoginResponse, Error, GoogleLoginInput>({
        mutationFn: (data: GoogleLoginInput) => 
            apiRequest<GoogleLoginResponse, GoogleLoginInput>("api/auth/google", {
                method: "POST",
                data
            })
    })
}