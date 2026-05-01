import { apiRequest } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AIReport } from "@/types/ai-report-types";

type CreateAiReportInput = {
    title: string;
    type: "ATS" | "JOB_MATCH" | "COVER_LETTER";
    jobDescription?: string;
    company?: string;
    role?: string;
    resumeSnapshot: string;
    result: any;
};

type CreateAiReportResponse = {
    success: boolean;
    report: AIReport;
};

export function useCreateAiReport() {
    const queryClient = useQueryClient();

    return useMutation<
        CreateAiReportResponse,
        Error,
        CreateAiReportInput
    >({
        mutationFn: (data) =>
            apiRequest<CreateAiReportResponse, CreateAiReportInput>(
                "/api/ai-report/create",
                {
                    method: "POST",
                    data,
                }
            ),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["ai-report-list"],
            });
        },
    });
}