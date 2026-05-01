import { uploadFiles } from "@/lib/uploadthing";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type UploadAiReportInput = {
    title: string;
    file: File;
};

type UploadAiReportResponse = {
    success: boolean;
    report: {
        uuid: string;
        title: string;
        pdfUrl?: string;
        createdAt: string;
    };
};

export function useUploadAiReport() {
    const queryClient = useQueryClient();

    return useMutation<UploadAiReportResponse, Error, UploadAiReportInput>({
        mutationFn: async ({ title, file }) => {
            // ✅ 1. upload to UploadThing (client)
            const uploaded = await uploadFiles("resumeUploader", {
                files: [file],
            });

            const pdfUrl = uploaded[0].url;

            // ✅ 2. send URL to backend
            const res = await fetch("/api/ai-report/upload", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, pdfUrl }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message);

            return data;
        },

        onSuccess: () => {
            // refresh dashboard list
            queryClient.invalidateQueries({
                queryKey: ["ai-report-list"],
            });

            // refresh user (tokens, subscription etc.)
            queryClient.invalidateQueries({
                queryKey: ["user"],
            });
        },
    });
}
