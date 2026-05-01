import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";

type LogoutResponse = {
    success: boolean;
    message: string;
};

export function useLogout() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () =>
            apiRequest<LogoutResponse, void>("/api/auth/logout", {
                method: "POST",
            }),

        onSuccess: () => {
            // 🧹 clear user cache
            queryClient.setQueryData(["user"], {
                success: false,
                user: null,
            });

            queryClient.invalidateQueries({ queryKey: ["user"] });
        },
    });
}
