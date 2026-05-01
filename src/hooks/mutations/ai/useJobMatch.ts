// src/hooks/mutations/ai/useJobMatch.ts

import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";

import {
    JobMatchInput,
    JobMatchResponse,
} from "@/types/ai-types";

export function useJobMatch() {
    return useMutation<
        JobMatchResponse,
        Error,
        JobMatchInput
    >({
        mutationFn: (data) =>
            apiRequest<
                JobMatchResponse,
                JobMatchInput
            >("/api/ai/job-match", {
                method: "POST",
                data,
            }),
    });
}