import { apiRequest } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type UpdateAiReportInput = {
    uuid: string;
    jobDescription?: string;
    company?: string;
    role?: string;
    result?: any;
    pdfUrl?: string;
};

type UpdateAiReportResponse = {
    success: boolean;
};

export function useUpdateAiReport() {
    const queryClient = useQueryClient();

    return useMutation<
        UpdateAiReportResponse,
        Error,
        UpdateAiReportInput
    >({
        mutationFn: ({ uuid, ...data }) =>
            apiRequest<UpdateAiReportResponse>(
                `/api/ai-report/${uuid}/update`,
                {
                    method: "PATCH",
                    data,
                }
            ),

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["ai-report", variables.uuid],
            });

            queryClient.invalidateQueries({
                queryKey: ["ai-report-list"],
            });
        },
    });
}