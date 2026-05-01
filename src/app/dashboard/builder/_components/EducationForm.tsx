import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EducationData } from "@/types/resume-types";
import { GraduationCap, Plus, Trash2 } from "lucide-react";

interface EducationFormProps {
    data: EducationData[] | undefined;
    onChange: (e: EducationData[]) => void;
}

export default function EducationForm({ data, onChange }: EducationFormProps) {
    function addEducation() {
        const newEducation = {
            institution: "",
            degree: "",
            field: "",
            graduationDate: "",
            gpa: "",
            id: "",
        };
        if (data) {
            onChange([...data, newEducation]);
        }
    }

    function removeEducation(index) {
        if (data) {
            const updated = data.filter((_, i) => i !== index);
            onChange(updated);
        }
    }

    function updateEducation(index, field, value) {
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
                        Education
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Add your education details
                    </p>
                </div>
                <Button
                    onClick={addEducation}
                    className="flex items-center gap-2 px-3 py-1"
                >
                    <Plus className="size-4" />
                    Add Education
                </Button>
            </div>
            {data && data.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                    <GraduationCap className="w-12 h-12 mx-auto mb-3" />
                    <p>No education added yet.</p>
                    <p className="text-sm">
                        Click &quot;Add Education&quot; to get startd
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {data &&
                        data.map((education, index) => (
                            <div
                                key={index}
                                className="p-4 border border-border rounded-lg space-y-3"
                            >
                                <div className="flex justify-between items-start">
                                    <h4>Experience #{index + 1}</h4>
                                    <Button
                                        onClick={() => removeEducation(index)}
                                        variant={"destructive"}
                                    >
                                        <Trash2 className="size-4" />
                                    </Button>
                                </div>
                                <div className="grid md:grid-cols-2 gap-3">
                                    <Input
                                        value={education.institution || ""}
                                        onChange={(e) =>
                                            updateEducation(
                                                index,
                                                "institution",
                                                e.target.value,
                                            )
                                        }
                                        type="text"
                                        placeholder="Institution Name"
                                        className="px-3 py-2 text-sm rounded-lg"
                                    />
                                    <Input
                                        value={education.degree || ""}
                                        onChange={(e) =>
                                            updateEducation(
                                                index,
                                                "degree",
                                                e.target.value,
                                            )
                                        }
                                        type="text"
                                        placeholder="Degree (Eg: Bachelor's, Master's)"
                                        className="px-3 py-2 text-sm rounded-lg"
                                    />
                                    <Input
                                        value={education.field || ""}
                                        onChange={(e) =>
                                            updateEducation(
                                                index,
                                                "field",
                                                e.target.value,
                                            )
                                        }
                                        type="text"
                                        placeholder="Field of Study"
                                        className="px-3 py-2 text-sm rounded-lg"
                                    />
                                    <Input
                                        value={education.graduationDate || ""}
                                        onChange={(e) =>
                                            updateEducation(
                                                index,
                                                "graduationDate",
                                                e.target.value,
                                            )
                                        }
                                        type="month"
                                        placeholder="Graduation Date"
                                        className="px-3 py-2 text-sm rounded-lg"
                                    />
                                    <Input
                                        value={education.gpa || ""}
                                        onChange={(e) =>
                                            updateEducation(
                                                index,
                                                "gpa",
                                                e.target.value,
                                            )
                                        }
                                        type="text"
                                        placeholder="GPA"
                                        className="px-3 py-2 text-sm rounded-lg"
                                    />
                                </div>
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
}
