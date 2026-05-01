import { apiRequest } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { User } from "@/types/user-types";

type UpdateProfileInput = {
    fullName?: string;
    profilePhoto?: string;
    currentPassword?: string;
    newPassword?: string;
};

type UpdateProfileResponse = {
    success: boolean;
    message: string;
    user: User;
};

export function useUpdateProfile() {
    const queryClient = useQueryClient();

    return useMutation<
        UpdateProfileResponse,
        Error,
        UpdateProfileInput
    >({
        mutationFn: (data: UpdateProfileInput) =>
            apiRequest<UpdateProfileResponse, UpdateProfileInput>(
                "/api/auth/update-profile",
                {
                    method: "PATCH",
                    data,
                }
            ),

        onSuccess: (data) => {
            // ✅ update user cache instantly
            queryClient.setQueryData(["user"], {
                success: true,
                user: data.user,
            });

            // optional: refetch to stay in sync
            queryClient.invalidateQueries({ queryKey: ["user"] });
        },
    });
}