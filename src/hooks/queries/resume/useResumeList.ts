// src/hooks/queries/resume/useResumeList.ts

import { apiRequest } from "@/lib/api";
import { ResumeList } from "@/types/resume-types";
import { useQuery } from "@tanstack/react-query";

type ResumeListResponse = {
    success: boolean;
    resumes: ResumeList;
};

export function useResumeList() {
    return useQuery<ResumeListResponse, Error>({
        queryKey: ["resume-list"],

        queryFn: () =>
            apiRequest<ResumeListResponse>(
                "/api/resume/list"
            ),
    });
}