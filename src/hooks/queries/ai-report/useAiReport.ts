import { apiRequest } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { AIReport } from "@/types/ai-report-types";

type GetAiReportResponse = {
    success: boolean;
    report: AIReport;
};

export function useAiReport(uuid: string) {
    return useQuery<GetAiReportResponse>({
        queryKey: ["ai-report", uuid],
        queryFn: () =>
            apiRequest<GetAiReportResponse>(`/api/ai-report/${uuid}`),
        enabled: !!uuid,
    });
}