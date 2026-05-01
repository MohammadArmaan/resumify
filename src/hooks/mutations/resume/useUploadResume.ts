// src/hooks/mutations/resume/useUploadResume.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { UploadResumeInput, UploadResumeResponse } from "@/types/upload-resume-types";

export function useUploadResume() {
    const queryClient =
        useQueryClient();

    return useMutation<
        UploadResumeResponse,
        Error,
        UploadResumeInput
    >({
        mutationFn: async ({
            title,
            file,
        }) => {
            const formData =
                new FormData();

            formData.append(
                "title",
                title
            );

            formData.append(
                "file",
                file
            );

            const response =
                await fetch(
                    "/api/resume/upload",
                    {
                        method:
                            "POST",
                        body: formData,
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Upload failed"
                );
            }

            return data;
        },

        onSuccess: () => {
            queryClient.invalidateQueries(
                {
                    queryKey: [
                        "resume-list",
                    ],
                }
            );

            queryClient.invalidateQueries(
                {
                    queryKey: [
                        "user",
                    ],
                }
            );
        },
    });
}