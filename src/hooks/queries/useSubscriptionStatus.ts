// src/hooks/queries/useSubscriptionStatus.ts
import { apiRequest } from "@/lib/api";
import { SubscriptionStatusResponse } from "@/types/subscription-types";
import { useQuery } from "@tanstack/react-query";

export function useSubscriptionStatus() {
    return useQuery<SubscriptionStatusResponse, Error>({  // ← remove the void 3rd generic
        queryKey: ["subscription-status"],
        queryFn: () => apiRequest<SubscriptionStatusResponse, void>("/api/subscription/status", {
            method: "GET"
        }),
        staleTime: 2 * 60 * 1000,
    });
}