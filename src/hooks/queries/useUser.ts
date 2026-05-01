import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { User } from "@/types/user-types";

type MeResponse = {
    success: boolean;
    user: User | null;
};

export function useUser() {
    return useQuery<MeResponse>({
        queryKey: ["user"],

        queryFn: async () => {
            try {
                return await apiRequest<MeResponse, void>(
                    "/api/auth/me",
                    {
                        method: "GET",
                    }
                );
            } catch {
                // 👇 unauthorized / guest user
                return {
                    success: false,
                    user: null,
                };
            }
        },

        retry: false,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5,
    });
}