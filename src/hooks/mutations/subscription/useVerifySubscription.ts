import { apiRequest } from "@/lib/api";
import { VerifySubscriptionInput, VerifySubscriptionResponse } from "@/types/subscription-types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useVerifySubscription() {
    const queryClient = useQueryClient();

    return useMutation<
        VerifySubscriptionResponse,
        Error,
        VerifySubscriptionInput
    >({
        mutationFn: (data) =>
            apiRequest<
                VerifySubscriptionResponse,
                VerifySubscriptionInput
            >("/api/subscription/verify", {
                method: "POST",
                data,
            }),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["subscription-status"],
            });
        },
    });
}