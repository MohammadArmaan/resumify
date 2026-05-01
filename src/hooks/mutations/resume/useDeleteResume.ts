// src/hooks/mutations/resume/useDeleteResume.ts

import { apiRequest } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type DeleteResumeInput = {
    uuid: string;
};

type DeleteResumeResponse = {
    success: boolean;
    message: string;
};

export function useDeleteResume() {
    const queryClient = useQueryClient();

    return useMutation<
        DeleteResumeResponse,
        Error,
        DeleteResumeInput
    >({
        mutationFn: ({ uuid }) =>
            apiRequest<DeleteResumeResponse>(
                `/api/resume/${uuid}`,
                {
                    method: "DELETE",
                }
            ),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["resume-list"],
            });
        },
    });
}