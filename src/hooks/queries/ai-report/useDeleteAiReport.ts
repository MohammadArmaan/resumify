import { apiRequest } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type DeleteAiReportInput = {
    uuid: string;
};

type DeleteAiReportResponse = {
    success: boolean;
};

export function useDeleteAiReport() {
    const queryClient = useQueryClient();

    return useMutation<
        DeleteAiReportResponse,
        Error,
        DeleteAiReportInput
    >({
        mutationFn: ({ uuid }) =>
            apiRequest<DeleteAiReportResponse>(
                `/api/ai-report/${uuid}/delete`,
                {
                    method: "DELETE",
                }
            ),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["ai-report-list"],
            });
        },
    });
}