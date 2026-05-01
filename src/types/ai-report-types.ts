export type AIReportType = "ATS" | "JOB_MATCH" | "COVER_LETTER";

export type AIReport = {
    id: number;
    uuid: string;
    userId: number;
    title: string;
    type: AIReportType;

    jobDescription?: string;
    company?: string;
    role?: string;
    resumeSnapshot: string;

    result: any;

    pdfUrl?: string;

    createdAt: string;
    updatedAt: string;
};