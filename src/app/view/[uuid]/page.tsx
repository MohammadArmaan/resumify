"use client";
import ResumePreview from "@/app/dashboard/builder/_components/ResumePreview";
import { dummyResumeData } from "@/assets/assets";
import { LoadingScreen } from "@/components/LoadingScreen";
import { useResume } from "@/hooks/queries/resume/useResume";
import { ResumeData } from "@/types/resume-types";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ViewPage() {
    const { uuid } = useParams<{ uuid: string }>();

    const [resumeData, setResumeData] = useState<ResumeData | null>(null);

    const { data: resumeResponse, isError, error, isLoading } = useResume(uuid);

    // Populate local state once the resume is fetched
    useEffect(() => {
        if (resumeResponse?.resume) {
            setResumeData(resumeResponse.resume);
            document.title = resumeResponse.resume.title;
        }
    }, [resumeResponse]);

        // Show API fetch error
    useEffect(() => {
        if (isError && error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Failed to load resume";
            toast.error(message);
        }
    }, [isError, error]);

    return resumeData?.public ? (
        <div className="bg-slate-100">
            <div className="max-w-3xl mx-auto py-10">
                <ResumePreview
                    data={resumeData}
                    template={resumeData.template}
                    accentColor={resumeData.accentColor}
                    classes="py-4 bg-background"
                />
            </div>
        </div>
    ) : (
        <div>
            {isLoading ? (
                <LoadingScreen />
            ) : (
                <div className="flex flex-col items-center justify-center h-screen">
                    <p className="text-center text-6xl text-muted-foreground font-medium">
                        Resume not found!
                    </p>
                    <Link href="/" className="flex items-center gap-2 bg-primary px-4 py-2 rounded-lg text-white hover:bg-green-600 mt-5 hover:ring ring-green-700">
                        <ArrowLeftIcon className="size-4 mr-2" />
                        Go Back to Home Page
                    </Link>
                </div>
            )}
        </div>
    );
}
