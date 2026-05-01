import { apiRequest } from "@/lib/api";
import {
    CreateSubscriptionInput,
    CreateSubscriptionResponse,
} from "@/types/subscription-types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateSubscription() {
    const queryClient = useQueryClient();
    return useMutation<
        CreateSubscriptionResponse,
        Error,
        CreateSubscriptionInput
    >({
        mutationFn: (data: CreateSubscriptionInput) =>
            apiRequest<CreateSubscriptionResponse, CreateSubscriptionInput>(
                "/api/subscription/create",
                {
                    method: "POST",
                    data,
                },
            ),
            onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["subscription-status"],
            });
        },
    });
}
