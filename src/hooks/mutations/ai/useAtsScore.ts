// src/hooks/mutations/ai/useAtsScore.ts

import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";

import { AtsScoreInput, AtsScoreResponse } from "@/types/ai-types";

export function useAtsScore() {
    return useMutation<AtsScoreResponse, Error, AtsScoreInput>({
        mutationFn: (data) =>
            apiRequest<AtsScoreResponse, AtsScoreInput>("/api/ai/ats-score", {
                method: "POST",
                data,
            }),
    });
}
