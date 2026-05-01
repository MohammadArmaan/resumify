import { apiRequest } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type UpdateTitleInput = {
    uuid: string;
    title: string;
};

type UpdateTitleResponse = {
    success: boolean;
};

export function useUpdateAiReportTitle() {
    const queryClient = useQueryClient();

    return useMutation<
        UpdateTitleResponse,
        Error,
        UpdateTitleInput
    >({
        mutationFn: ({ uuid, title }) =>
            apiRequest<UpdateTitleResponse>(
                `/api/ai-report/${uuid}/update-title`,
                {
                    method: "PATCH",
                    data: { title },
                }
            ),

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["ai-report-list"],
            });

            queryClient.invalidateQueries({
                queryKey: ["ai-report", variables.uuid],
            });
        },
    });
}