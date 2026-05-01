import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PersonalInfoData } from "@/types/resume-types";
import {
    BriefcaseBusiness,
    Globe,
    Mail,
    MapPin,
    Phone,
    Scissors,
    User2,
} from "lucide-react";
import { FaLinkedinIn } from "react-icons/fa";
import { FaGithub } from "react-icons/fa6";

interface PersonalInfoProps {
    data: PersonalInfoData;
    onChange: (updatedData: PersonalInfoData) => void;
    removeBackground: boolean;
    setRemoveBackground: React.Dispatch<React.SetStateAction<boolean>>;
}

const fields = [
    {
        key: "fullName",
        label: "Full Name",
        icon: User2,
        type: "text",
        required: true,
    },
    {
        key: "email",
        label: "Email Address",
        icon: Mail,
        type: "email",
        required: true,
    },
    {
        key: "phone",
        label: "Phone Number",
        icon: Phone,
        type: "tel",
    },
    {
        key: "location",
        label: "Location",
        icon: MapPin,
        type: "text",
    },
    {
        key: "profession",
        label: "Profession",
        icon: BriefcaseBusiness,
        type: "text",
    },
    {
        key: "linkedin",
        label: "LinkedIn Profile",
        icon: FaLinkedinIn,
        type: "url",
    },
    {
        key: "github",
        label: "Github Profile",
        icon: FaGithub,
        type: "url",
    },
    {
        key: "website",
        label: "Personal Website",
        icon: Globe,
        type: "url",
    },
];

export default function PersonalInfoForm({
    data,
    onChange,
    removeBackground,
    setRemoveBackground,
}: PersonalInfoProps) {
    function handleChange(field: string, value: string | File) {
        onChange({
            ...data,
            [field]: value,
        });
    }

    // Derive the src shown in the avatar preview:
    // - File object  → object URL (bg removal happens on save, show a badge instead)
    // - URL string + removeBackground → append ImageKit transform for live preview
    // - URL string only → use as-is
    function getPreviewSrc(): string | null {
        if (!data.image) return null;

        if (data.image instanceof File) {
            return URL.createObjectURL(data.image);
        }

        if (removeBackground) {
            // Strip any existing tr param before appending to avoid duplicates
            const base = data.image.split("?")[0];
            return `${base}?tr=e-bgremove`;
        }

        return data.image;
    }

    const previewSrc = getPreviewSrc();
    const isFileObject = data.image instanceof File;

    return (
        <div>
            <h3 className="text-lg font-semibold">Personal Information</h3>

            <p className="text-sm text-foreground/70">
                Get Started with personal information
            </p>

            <div className="flex items-center gap-3 mt-2">
                <Label className="cursor-pointer">
                    {previewSrc ? (
                        <div className="relative mt-5 w-16 h-16">
                            <img
                                src={previewSrc}
                                alt="User Image"
                                className="w-16 h-16 rounded-full object-cover ring ring-green-600 hover:opacity-80 transition-opacity"
                            />
                            {/* Badge shown for File objects when removeBackground is on,
                                since the transform can't be applied client-side before upload */}
                            {isFileObject && removeBackground && (
                                <span className="absolute -bottom-1 -right-1 bg-green-600 text-white rounded-full p-0.5 shadow">
                                    <Scissors className="size-3" />
                                </span>
                            )}
                        </div>
                    ) : (
                        <div className="inline-flex items-center gap-2 mt-2 text-foreground/70 hover:text-foreground">
                            <User2 className="size-10 p-2.5 border rounded-full" />
                            Upload User Image
                        </div>
                    )}

                    <Input
                        type="file"
                        accept="image/jpeg,image/png"
                        className="hidden"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleChange("image", file);
                        }}
                    />
                </Label>

                {data.image && (
                    <div className="flex flex-col gap-1 text-sm">
                        <p className="text-foreground/70">Remove Background</p>

                        <Label className="relative inline-flex items-center cursor-pointer gap-3">
                            <Input
                                type="checkbox"
                                className="sr-only peer"
                                checked={removeBackground}
                                onChange={() =>
                                    setRemoveBackground((prev) => !prev)
                                }
                            />
                            <div className="w-9 h-5 bg-slate-300 rounded-full peer-checked:bg-green-600 transition-colors duration-200 relative">
                                <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ease-in-out [[type=checkbox]:checked~*_&]:translate-x-4" />
                            </div>

                            {/* Live preview label */}
                            {removeBackground && (
                                <span className="text-xs text-green-600 font-medium">
                                    {isFileObject ? "Applied on save" : "Live preview"}
                                </span>
                            )}
                        </Label>
                    </div>
                )}
            </div>

            {fields.map((field) => {
                const Icon = field.icon;
                return (
                    <div key={field.key} className="space-y-1 mt-5">
                        <Label className="flex items-center gap-2">
                            <Icon className="size-4" />
                            {field.label}
                            {field.required && (
                                <span className="text-red-500">*</span>
                            )}
                        </Label>
                        <Input
                            type={field.type}
                            value={(data[field.key] as string) || ""}
                            onChange={(e) =>
                                handleChange(field.key, e.target.value)
                            }
                            className="mt-1 w-full px-3 py-2 border-border rounded-lg transition-colors text-sm"
                            placeholder={`Enter your ${field.label.toLocaleLowerCase()}`}
                            required={field.required}
                        />
                    </div>
                );
            })}
        </div>
    );
}