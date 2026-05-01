// src/hooks/mutations/resume/useCreateResume.ts

import { apiRequest } from "@/lib/api";
import { ResumeData } from "@/types/resume-types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type CreateResumeInput = {
    title: string;
};

type CreateResumeResponse = {
    success: boolean;
    message: string;
    resume: ResumeData;
};

export function useCreateResume() {
    const queryClient = useQueryClient();

    return useMutation<
        CreateResumeResponse,
        Error,
        CreateResumeInput
    >({
        mutationFn: (data) =>
            apiRequest<CreateResumeResponse, CreateResumeInput>(
                "/api/resume",
                {
                    method: "POST",
                    data,
                }
            ),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["resume-list"],
            });
        },
    });
}