// useEnhanceDescription.ts

import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";

import {
    EnhanceDescriptionInput,
    EnhanceDescriptionResponse,
} from "@/types/ai-types";

export function useEnhanceDescription() {
    return useMutation<
        EnhanceDescriptionResponse,
        Error,
        EnhanceDescriptionInput
    >({
        mutationFn: (data) =>
            apiRequest<EnhanceDescriptionResponse, EnhanceDescriptionInput>(
                "/api/ai/enhance-description",
                {
                    method: "POST",
                    data,
                },
            ),
    });
}
