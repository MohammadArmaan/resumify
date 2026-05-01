import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEnhanceDescription } from "@/hooks/mutations/ai/useEnhanceDescription";
import { useUser } from "@/hooks/queries/useUser";
import { ExperienceData } from "@/types/resume-types";
import { Briefcase, Plus, Sparkles, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface ExperienceFormProps {
    data: ExperienceData[] | undefined;
    onChange: (e: ExperienceData[]) => void;
}
export default function ExperienceForm({
    data,
    onChange,
}: ExperienceFormProps) {
    const { data: user } = useUser();
    const isSubscribed = user?.user?.isSubscribed;

    const enhanceDescription = useEnhanceDescription();

    function addExperience() {
        const newExperience = {
            company: "",
            position: "",
            startDate: "",
            endDate: "",
            description: "",
            isCurrent: false,
            id: "",
        };
        if (data) {
            onChange([...data, newExperience]);
        }
    }

    // replace old handleEnhanceAI()

    function handleEnhanceAI(index: number, description: string) {
        if (!description.trim()) {
            toast.error("Please add a description first.");
            return;
        }

        enhanceDescription.mutate(
            { text: description },
            {
                onSuccess: (response) => {
                    if (!data) return;

                    const updated = [...data];

                    updated[index] = {
                        ...updated[index],
                        description: response.enhancedText,
                    };

                    onChange(updated);

                    toast.success("Description enhanced successfully!");
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

    function removeExperience(index) {
        if (data) {
            const updated = data.filter((_, i) => i !== index);
            onChange(updated);
        }
    }

    function updateExperience(index, field, value) {
        if (data) {
            const updated = [...data];
            updated[index] = { ...updated[index], [field]: value };
            onChange(updated);
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-3 flex-col md:flex-row">
                <div>
                    <h3 className="flex items-center gap-2 text-lg font-semibold">
                        Professional Experience
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Add your job experience
                    </p>
                </div>
                <Button
                    onClick={addExperience}
                    className="flex items-center gap-2 px-3 py-1"
                >
                    <Plus className="size-4" />
                    Add Experience
                </Button>
            </div>
            {data && data.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                    <Briefcase className="w-12 h-12 mx-auto mb-3" />
                    <p>No Work Experience added yet.</p>
                    <p className="text-sm">
                        Click &quot;Add Experience&quot; to get startd
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {data &&
                        data.map((experience, index) => (
                            <div
                                key={index}
                                className="p-4 border border-border rounded-lg space-y-3"
                            >
                                <div className="flex justify-between items-start">
                                    <h4>Experience #{index + 1}</h4>
                                    <Button
                                        onClick={() => removeExperience(index)}
                                        variant={"destructive"}
                                    >
                                        <Trash2 className="size-4" />
                                    </Button>
                                </div>
                                <div className="grid md:grid-cols-2 gap-3">
                                    <Input
                                        value={experience.company || ""}
                                        onChange={(e) =>
                                            updateExperience(
                                                index,
                                                "company",
                                                e.target.value,
                                            )
                                        }
                                        type="text"
                                        placeholder="Company Name"
                                        className="px-3 py-2 text-sm rounded-lg"
                                    />
                                    <Input
                                        value={experience.position || ""}
                                        onChange={(e) =>
                                            updateExperience(
                                                index,
                                                "position",
                                                e.target.value,
                                            )
                                        }
                                        type="text"
                                        placeholder="Job Title"
                                        className="px-3 py-2 text-sm rounded-lg"
                                    />
                                    <Input
                                        value={experience.startDate || ""}
                                        onChange={(e) =>
                                            updateExperience(
                                                index,
                                                "startDate",
                                                e.target.value,
                                            )
                                        }
                                        type="month"
                                        placeholder="Start Date"
                                        className="px-3 py-2 text-sm rounded-lg"
                                    />
                                    <Input
                                        value={experience.endDate || ""}
                                        onChange={(e) =>
                                            updateExperience(
                                                index,
                                                "endDate",
                                                e.target.value,
                                            )
                                        }
                                        type="month"
                                        placeholder="End Date"
                                        className="px-3 py-2 text-sm rounded-lg"
                                        disabled={experience.isCurrent}
                                    />
                                </div>
                                <Label>
                                    <Input
                                        type="checkbox"
                                        checked={experience.isCurrent || false}
                                        onChange={(e) =>
                                            updateExperience(
                                                index,
                                                "isCurrent",
                                                e.target.checked ? true : false,
                                            )
                                        }
                                        className="rounded border-border h-4 w-4"
                                    />
                                    <span className="text-sm">
                                        Currently working here
                                    </span>
                                </Label>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between flex-wrap gap-2">
                                        <Label className="text-sm font-medium">
                                            Job Description
                                        </Label>
                                        {isSubscribed && (
                                            // update button call

                                            <Button
                                                onClick={() =>
                                                    handleEnhanceAI(
                                                        index,
                                                        experience.description,
                                                    )
                                                }
                                                className="flex items-center gap-1 px-2 py-1"
                                                disabled={
                                                    !isSubscribed ||
                                                    enhanceDescription.isPending
                                                }
                                            >
                                                <Sparkles className="size-4" />

                                                {enhanceDescription.isPending
                                                    ? "Enhancing..."
                                                    : "Enhance with AI"}
                                            </Button>
                                        )}
                                    </div>
                                    <Textarea
                                        value={experience.description || ""}
                                        onChange={(e) =>
                                            updateExperience(
                                                index,
                                                "description",
                                                e.target.value,
                                            )
                                        }
                                        className="w-full text-sm px-3 py-2 rounded-lg resize-none"
                                        rows={12}
                                        placeholder="Describe your key responsiblities and achivements..."
                                    />
                                </div>
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
}
