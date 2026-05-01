// src/hooks/mutations/resume/useUpdateResumeTitle.ts

import { apiRequest } from "@/lib/api";
import { ResumeData } from "@/types/resume-types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type UpdateResumeTitleInput = {
    uuid: string;
    title: string;
};

type UpdateResumeTitleResponse = {
    success: boolean;
    message: string;
    resume: ResumeData;
};

export function useUpdateResumeTitle() {
    const queryClient = useQueryClient();

    return useMutation<
        UpdateResumeTitleResponse,
        Error,
        UpdateResumeTitleInput
    >({
        mutationFn: ({ uuid, title }) =>
            apiRequest<
                UpdateResumeTitleResponse,
                { title: string }
            >(`/api/resume/title/${uuid}`, {
                method: "PATCH",
                data: { title },
            }),

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