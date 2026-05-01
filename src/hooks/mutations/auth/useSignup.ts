// hooks/mutations/auth/useSignup.ts
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { User } from "@/types/user-types";

type SignupInput = {
    fullName: string;
    email: string;
    password: string;
};

type AuthResponse = {
    success: boolean;
    message: string;
    user: User;
};

export function useSignup() {
    return useMutation<AuthResponse, Error, SignupInput>({
        mutationFn: (data: SignupInput) =>
            apiRequest<AuthResponse, SignupInput>("/api/auth/sign-up", {
                method: "POST",
                data,
            }),
    });
}
