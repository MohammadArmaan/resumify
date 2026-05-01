// src/hooks/mutations/ai/useCoverLetter.ts

import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";

import {
    CoverLetterInput,
    CoverLetterResponse,
} from "@/types/ai-types";

export function useCoverLetter() {
    return useMutation<
        CoverLetterResponse,
        Error,
        CoverLetterInput
    >({
        mutationFn: (data) =>
            apiRequest<
                CoverLetterResponse,
                CoverLetterInput
            >("/api/ai/cover-letter", {
                method: "POST",
                data,
            }),
    });
}