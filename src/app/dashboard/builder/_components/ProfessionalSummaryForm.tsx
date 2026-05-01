import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useEnhanceDescription } from "@/hooks/mutations/ai/useEnhanceDescription";
import { useUser } from "@/hooks/queries/useUser";
import { ResumeData } from "@/types/resume-types";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";

interface ProfessionalSummaryForProps {
    data: string | undefined;
    onChange: (value: string) => void;
    setResumeData?: React.Dispatch<React.SetStateAction<ResumeData | null>>;
}

export default function ProfessionalSummaryForm({
    data,
    onChange,
    setResumeData,
}: ProfessionalSummaryForProps) {
    const { data: user } = useUser();
    const isSubscribed = user?.user?.isSubscribed;

    const enhanceDescription = useEnhanceDescription();

    // replace old handleEnhanceAI()

    function handleEnhanceAI(summary: string | undefined) {
        if (!summary?.trim()) {
            toast.error("Please write a professional summary first.");
            return;
        }

        enhanceDescription.mutate(
            { text: summary },
            {
                onSuccess: (response) => {
                    onChange(response.enhancedText);

                    if (setResumeData) {
                        setResumeData((prev) =>
                            prev
                                ? {
                                      ...prev,
                                      professionalSummary:
                                          response.enhancedText,
                                  }
                                : prev,
                        );
                    }

                    toast.success(
                        "Professional summary enhanced successfully!",
                    );
                },

                onError: (err) => {
                    const message =
                        err instanceof Error
                            ? err.message
                            : "AI enhancement failed";

                    toast.error(message);
                },
            },
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="flex items-center gap-2 text-lg font-semibold">
                        Professional Summary
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Add summary for your resume here
                    </p>
                </div>
                {isSubscribed && (
                    <Button
                        onClick={() => handleEnhanceAI(data)}
                        className="flex items-center gap-2 px-3 py-1"
                        disabled={!isSubscribed || enhanceDescription.isPending}
                    >
                        <Sparkles className="size-4" />

                        {enhanceDescription.isPending
                            ? "Enhancing..."
                            : "AI Enhance"}
                    </Button>
                )}
            </div>
            <div className="mt-6">
                <Textarea
                    value={data || ""}
                    onChange={(e) => onChange(e.target.value)}
                    name="professional-summary"
                    id="professional-summary"
                    rows={12}
                    placeholder="Write a compelling professional summary that highlights your key strengths and career objectives..."
                    className="min-h-50 resize-y"
                />
                <p className="text-xs text-muted-foreground mx-auto max-w-4/5 text-center mt-2">
                    Tip: keep it concise (3-4 sentences) and focus on your most
                    relevant achivements and skills.
                </p>
            </div>
        </div>
    );
}
