// src/hooks/mutations/ai/useParseResume.ts

import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";

import {
    ParseResumeInput,
    ParseResumeResponse,
} from "@/types/ai-types";

export function useParseResume() {
    return useMutation<
        ParseResumeResponse,
        Error,
        ParseResumeInput
    >({
        mutationFn: (data) =>
            apiRequest<
                ParseResumeResponse,
                ParseResumeInput
            >("/api/ai/parse-resume", {
                method: "POST",
                data,
            }),
    });
}