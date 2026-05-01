// src/hooks/mutations/resume/useUpdateResume.ts

import { apiRequest } from "@/lib/api";
import { ResumeData } from "@/types/resume-types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type UpdateResumeInput = {
    uuid: string;
    data: Partial<ResumeData>;
};

type UpdateResumeResponse = {
    success: boolean;
    message: string;
    resume: ResumeData;
};

export function useUpdateResume() {
    const queryClient = useQueryClient();

    return useMutation<
        UpdateResumeResponse,
        Error,
        UpdateResumeInput
    >({
        mutationFn: ({ uuid, data }) =>
            apiRequest<UpdateResumeResponse, Partial<ResumeData>>(
                `/api/resume/${uuid}`,
                {
                    method: "PATCH",
                    data,
                }
            ),

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["resume", variables.uuid],
            });

            queryClient.invalidateQueries({
                queryKey: ["resume-list"],
            });
        },
    });
}