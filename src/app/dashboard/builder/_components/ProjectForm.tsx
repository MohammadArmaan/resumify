import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEnhanceDescription } from "@/hooks/mutations/ai/useEnhanceDescription";
import { useUser } from "@/hooks/queries/useUser";
import { ProjectData } from "@/types/resume-types";
import { LayoutTemplate, Plus, Sparkles, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface ProjectFormProps {
    data: ProjectData[] | undefined;
    onChange: (e: ProjectData[]) => void;
}

export default function ProjectForm({ data, onChange }: ProjectFormProps) {
    const { data: user } = useUser();
    const isSubscribed = user?.user?.isSubscribed;

    const enhanceDescription = useEnhanceDescription();

    function addProject() {
        const newProject = {
            name: "",
            type: "",
            description: "",
            id: "",
        };
        if (data) {
            onChange([...data, newProject]);
        }
    }

    function removeProject(index) {
        if (data) {
            const updated = data.filter((_, i) => i !== index);
            onChange(updated);
        }
    }

    function updateProject(index, field, value) {
        if (data) {
            const updated = [...data];
            updated[index] = { ...updated[index], [field]: value };
            onChange(updated);
        }
    }

    function handleEnhanceAI(index: number, description: string) {
        if (!description.trim()) {
            toast.error("Please add a project description first.");
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

                    toast.success("Project description enhanced successfully!");
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
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-3 flex-col md:flex-row">
                <div>
                    <h3 className="flex items-center gap-2 text-lg font-semibold">
                        Projects
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Add your project details
                    </p>
                </div>
                <Button
                    onClick={addProject}
                    className="flex items-center gap-2 px-3 py-1"
                >
                    <Plus className="size-4" />
                    Add Project
                </Button>
            </div>
            {data && data.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                    <LayoutTemplate className="w-12 h-12 mx-auto mb-3" />
                    <p>No project added yet.</p>
                    <p className="text-sm">
                        Click &quot;Add Project&quot; to get startd
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {data &&
                        data.map((project, index) => (
                            <div
                                key={index}
                                className="p-4 border border-border rounded-lg space-y-3"
                            >
                                <div className="flex justify-between items-start">
                                    <h4>Experience #{index + 1}</h4>
                                    <Button
                                        onClick={() => removeProject(index)}
                                        variant={"destructive"}
                                    >
                                        <Trash2 className="size-4" />
                                    </Button>
                                </div>
                                <div className="grid md:grid-cols-2 gap-3">
                                    <Input
                                        value={project.name || ""}
                                        onChange={(e) =>
                                            updateProject(
                                                index,
                                                "name",
                                                e.target.value,
                                            )
                                        }
                                        type="text"
                                        placeholder="Project Name"
                                        className="px-3 py-2 text-sm rounded-lg"
                                    />
                                    <Input
                                        value={project.type || ""}
                                        onChange={(e) =>
                                            updateProject(
                                                index,
                                                "type",
                                                e.target.value,
                                            )
                                        }
                                        type="text"
                                        placeholder="Project Type"
                                        className="px-3 py-2 text-sm rounded-lg"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between flex-wrap gap-2">
                                        <Label className="text-sm font-medium">
                                            Project Description
                                        </Label>

                                        {isSubscribed && (
                                            <Button
                                                onClick={() =>
                                                    handleEnhanceAI(
                                                        index,
                                                        project.description,
                                                    )
                                                }
                                                disabled={
                                                    !isSubscribed ||
                                                    enhanceDescription.isPending
                                                }
                                                className="flex items-center gap-1 px-2 py-1"
                                            >
                                                <Sparkles className="size-4" />

                                                {enhanceDescription.isPending
                                                    ? "Enhancing..."
                                                    : "Enhance with AI"}
                                            </Button>
                                        )}
                                    </div>
                                    <Textarea
                                        value={project.description || ""}
                                        onChange={(e) =>
                                            updateProject(
                                                index,
                                                "description",
                                                e.target.value,
                                            )
                                        }
                                        className="w-full text-sm px-3 py-2 rounded-lg resize-none"
                                        rows={12}
                                        placeholder="Describe your project"
                                    />
                                </div>
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
}
