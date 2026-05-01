// src/hooks/queries/resume/useResume.ts

import { apiRequest } from "@/lib/api";
import { ResumeData } from "@/types/resume-types";
import { useQuery } from "@tanstack/react-query";

type ResumeResponse = {
    success: boolean;
    resume: ResumeData;
};

export function useResume(uuid: string) {
    return useQuery<ResumeResponse, Error>({
        queryKey: ["resume", uuid],

        queryFn: () => apiRequest<ResumeResponse>(`/api/resume/${uuid}/view`),

        enabled: !!uuid,
    });
}
