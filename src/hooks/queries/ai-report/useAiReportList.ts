import { apiRequest } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

type AiReportListResponse = {
    success: boolean;
    reports: {
        uuid: string;
        title: string;
        updatedAt: string;
    }[];
};

export function useAiReportList() {
    return useQuery<AiReportListResponse>({
        queryKey: ["ai-report-list"],
        queryFn: () =>
            apiRequest<AiReportListResponse>("/api/ai-report/list"),
    });
}