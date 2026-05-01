"use client";

import {
    ArrowLeft,
    Briefcase,
    ChevronLeft,
    ChevronRight,
    DownloadIcon,
    EyeIcon,
    EyeOff,
    FileText,
    FolderIcon,
    GraduationCap,
    Share2Icon,
    Sparkles,
    User2,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import PersonalInfoForm from "../_components/PersonalInfoForm";
import ResumePreview from "../_components/ResumePreview";
import TemplateSelector from "../_components/TemplateSelector";
import ColorPicker from "../_components/ColorPicker";
import ProfessionalSummaryForm from "../_components/ProfessionalSummaryForm";
import { ResumeData } from "@/types/resume-types";
import ExperienceForm from "../_components/ExperienceForm";
import EducationForm from "../_components/EducationForm";
import ProjectForm from "../_components/ProjectForm";
import SkillsForm from "../_components/SkillsForm";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useResume } from "@/hooks/queries/resume/useResume";
import { useUpdateResume } from "@/hooks/mutations/resume/useUpdateResume";
import { uploadFiles } from "@/lib/uploadthing";
import { LoadingScreen } from "@/components/LoadingScreen";
import { useUpdatePublicResume } from "@/hooks/mutations/resume/useUpdatePublicResume";
import AIResumeCheck from "../_components/AIResumeCheck";

const sections = [
    { id: "personal", name: "Personal Info", icon: User2 },
    { id: "summary", name: "Summary", icon: FileText },
    { id: "experience", name: "Experience", icon: Briefcase },
    { id: "education", name: "Education", icon: GraduationCap },
    { id: "projects", name: "Projects", icon: FolderIcon },
    { id: "skills", name: "Skills", icon: Sparkles },
    { id: "ai-check", name: "AI Check", icon: Sparkles },
];

export default function BuilderPage() {
    const { uuid } = useParams<{ uuid: string }>();
    const router = useRouter();
    const searchParams = useSearchParams();

    // Read section index from URL, fallback to 0
    const sectionParam = searchParams.get("section");
    const initialIndex =
        sectionParam !== null
            ? Math.min(
                  Math.max(parseInt(sectionParam, 10) || 0, 0),
                  sections.length - 1,
              )
            : 0;

    const [resumeData, setResumeData] = useState<ResumeData | null>(null);
    const [activeSectionIndex, setActiveSectionIndex] = useState(initialIndex);
    const [removeBackground, setRemoveBackground] = useState(false);

    const { data: resumeResponse, isError, error, isLoading } = useResume(uuid);
    const updateResume = useUpdateResume();
    const updatePublicResume = useUpdatePublicResume();

    const activeSection = sections[activeSectionIndex];

    // Sync section index to URL
    function goToSection(index: number) {
        const clamped = Math.min(Math.max(index, 0), sections.length - 1);
        const params = new URLSearchParams(searchParams.toString());
        params.set("section", String(clamped));
        router.replace(`?${params.toString()}`, { scroll: false });
        setActiveSectionIndex(clamped);
    }

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

    function handleResumeVisibility() {
        if (!resumeData) return;

        updatePublicResume.mutate(
            {
                uuid,
                data: {
                    public: !resumeData.public,
                },
            },
            {
                onSuccess: (response) => {
                    setResumeData(response.resume);

                    toast.success(
                        response.resume.public
                            ? "Resume is now public"
                            : "Resume is now private",
                    );
                },

                onError: (err) => {
                    toast.error(err.message);
                },
            },
        );
    }

    function handleShareResume() {
        const resumeUrl = process.env.NEXT_PUBLIC_DOMAIN + "/view/" + uuid;

        if (navigator.share) {
            navigator.share({ url: resumeUrl, text: "My Resume" });
        } else {
            toast.error("Share not supported on this browser!");
        }
    }

    function handleDownloadResume() {
        window.print();
    }

    async function handleSaveChanges() {
        if (!resumeData) return;

        try {
            const finalData = { ...resumeData };
            const image = finalData.personalInfo.image;

            if (image && image instanceof File) {
                let finalUrl = "";

                if (removeBackground) {
                    const formData = new FormData();
                    formData.append("file", image);

                    const res = await fetch("/api/imagekit/remove-bg", {
                        method: "POST",
                        body: formData,
                    });

                    const data = await res.json();

                    finalUrl = data.url;
                } else {
                    const uploaded = await uploadFiles("imageUploader", {
                        files: [image],
                    });

                    finalUrl = uploaded?.[0]?.url || "";
                }

                finalData.personalInfo.image = finalUrl;
            }

            updateResume.mutate(
                { uuid, data: finalData },
                {
                    onSuccess: () => {
                        setResumeData(finalData);
                        toast.success("Changes saved!");
                    },
                    onError: (err) => toast.error(err.message),
                },
            );
        } catch (err) {
            toast.error("Image upload failed");
        }
    }

    if (isLoading) return <LoadingScreen />;

    return (
        <main className="min-h-screen container">
            <div className="flex items-center justify-between">
                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 p-1.5 text-muted-foreground hover:text-muted-foreground/70 hover:bg-accent rounded-lg"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Dashboard
                </Link>
            </div>

            <div className="max-w-7xl mx-auto px-4 mt-5 pb-8">
                <div className="flex flex-col-reverse lg:grid lg:grid-cols-12 gap-8 lg:items-start">
                    {/* ── Left Panel — Form ── */}
                    <div className="lg:col-span-5 lg:sticky lg:top-6 lg:self-start">
                        <div className="relative rounded-lg border border-border bg-card shadow-xl overflow-hidden">
                            {/* Progress bar */}
                            <div className="absolute top-0 left-0 right-0 h-0.5 bg-border" />
                            <div
                                className="absolute top-0 left-0 h-0.5 bg-linear-to-r from-green-500 to-green-600 transition-all duration-500"
                                style={{
                                    width: `${(activeSectionIndex * 100) / (sections.length - 1)}%`,
                                }}
                            />

                            <div className="p-6 pt-4">
                                {/* Section navigation */}
                                <div className="flex justify-between items-center mb-6 pb-3 border-b border-border">
                                    <div className="flex items-center gap-2">
                                        <TemplateSelector
                                            selectedTemplate={
                                                resumeData?.template ??
                                                "classic"
                                            }
                                            onChange={(template) =>
                                                setResumeData((prev) =>
                                                    prev
                                                        ? { ...prev, template }
                                                        : prev,
                                                )
                                            }
                                        />
                                        <ColorPicker
                                            selectedColor={
                                                resumeData?.accentColor ??
                                                "#1F2937"
                                            }
                                            onChange={(color) =>
                                                setResumeData((prev) =>
                                                    prev
                                                        ? {
                                                              ...prev,
                                                              accentColor:
                                                                  color,
                                                          }
                                                        : prev,
                                                )
                                            }
                                        />
                                    </div>
                                    <div />

                                    <div className="flex items-center gap-1">
                                        {activeSectionIndex !== 0 && (
                                            <button
                                                onClick={() =>
                                                    goToSection(
                                                        activeSectionIndex - 1,
                                                    )
                                                }
                                                className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium hover:bg-accent transition-all"
                                            >
                                                <ChevronLeft className="size-4" />
                                                Previous
                                            </button>
                                        )}
                                        <button
                                            onClick={() =>
                                                goToSection(
                                                    activeSectionIndex + 1,
                                                )
                                            }
                                            className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium hover:bg-accent transition-all ${
                                                activeSectionIndex ===
                                                    sections.length - 1 &&
                                                "opacity-40 pointer-events-none"
                                            }`}
                                            disabled={
                                                activeSectionIndex ===
                                                sections.length - 1
                                            }
                                        >
                                            Next
                                            <ChevronRight className="size-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Form Content */}
                                <div className="space-y-6">
                                    {activeSection.id === "personal" &&
                                        resumeData && (
                                            <PersonalInfoForm
                                                data={resumeData.personalInfo}
                                                onChange={(data) =>
                                                    setResumeData((prev) =>
                                                        prev
                                                            ? {
                                                                  ...prev,
                                                                  personalInfo:
                                                                      data,
                                                              }
                                                            : prev,
                                                    )
                                                }
                                                removeBackground={
                                                    removeBackground
                                                }
                                                setRemoveBackground={
                                                    setRemoveBackground
                                                }
                                            />
                                        )}
                                    {activeSection.id === "summary" &&
                                        resumeData && (
                                            <ProfessionalSummaryForm
                                                data={
                                                    resumeData.professionalSummary
                                                }
                                                onChange={(data) =>
                                                    setResumeData((prev) =>
                                                        prev
                                                            ? {
                                                                  ...prev,
                                                                  professionalSummary:
                                                                      data,
                                                              }
                                                            : prev,
                                                    )
                                                }
                                                setResumeData={setResumeData}
                                            />
                                        )}
                                    {activeSection.id === "experience" &&
                                        resumeData && (
                                            <ExperienceForm
                                                data={resumeData.experience}
                                                onChange={(data) =>
                                                    setResumeData((prev) =>
                                                        prev
                                                            ? {
                                                                  ...prev,
                                                                  experience:
                                                                      data,
                                                              }
                                                            : prev,
                                                    )
                                                }
                                            />
                                        )}
                                    {activeSection.id === "education" &&
                                        resumeData && (
                                            <EducationForm
                                                data={resumeData.education}
                                                onChange={(data) =>
                                                    setResumeData((prev) =>
                                                        prev
                                                            ? {
                                                                  ...prev,
                                                                  education:
                                                                      data,
                                                              }
                                                            : prev,
                                                    )
                                                }
                                            />
                                        )}
                                    {activeSection.id === "projects" &&
                                        resumeData && (
                                            <ProjectForm
                                                data={resumeData.project}
                                                onChange={(data) =>
                                                    setResumeData((prev) =>
                                                        prev
                                                            ? {
                                                                  ...prev,
                                                                  project: data,
                                                              }
                                                            : prev,
                                                    )
                                                }
                                            />
                                        )}
                                    {activeSection.id === "skills" &&
                                        resumeData && (
                                            <SkillsForm
                                                data={resumeData.skills}
                                                onChange={(data) =>
                                                    setResumeData((prev) =>
                                                        prev
                                                            ? {
                                                                  ...prev,
                                                                  skills: data,
                                                              }
                                                            : prev,
                                                    )
                                                }
                                            />
                                        )}
                                    {activeSection.id === "ai-check" &&
                                        resumeData && (
                                            <AIResumeCheck
                                                data={resumeData}
                                            />
                                        )}
                                </div>

                                <Button
                                    onClick={handleSaveChanges}
                                    disabled={
                                        updateResume.isPending || !resumeData
                                    }
                                    className="bg-linear-to-br from-green-100 to-green-200 ring-ring-300 text-green-600 ring hover:ring-green-400 transition-all rounded-lg px-6 py-2 mt-6 text-sm"
                                >
                                    {updateResume.isPending
                                        ? "Saving..."
                                        : "Save Changes"}
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* ── Right Panel — Resume Preview ── */}
                    <div className="lg:col-span-7">
                        <div className="w-full mb-4">
                            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:justify-end gap-2">
                                {resumeData?.public && (
                                    <Button
                                        onClick={handleShareResume}
                                        className="w-full sm:w-auto flex items-center justify-center gap-2 text-xs px-4 py-2 bg-linear-to-br from-blue-100 to-blue-200 text-blue-600 rounded-lg ring-1 ring-blue-300 hover:ring-blue-400 transition"
                                    >
                                        <Share2Icon className="size-4" />
                                        Share
                                    </Button>
                                )}

                                <Button
                                    onClick={handleResumeVisibility}
                                    className="w-full sm:w-auto flex items-center justify-center gap-2 text-xs px-4 py-2 bg-linear-to-br from-purple-100 to-purple-200 text-purple-600 rounded-lg ring-1 ring-purple-300 hover:ring-purple-400 transition"
                                    disabled={updatePublicResume.isPending}
                                >
                                    {resumeData?.public ? (
                                        <EyeIcon className="size-4" />
                                    ) : (
                                        <EyeOff className="size-4" />
                                    )}
                                    {resumeData?.public ? "Public" : "Private"}
                                </Button>

                                <Button
                                    onClick={handleDownloadResume}
                                    className="w-full sm:w-auto flex items-center justify-center gap-2 text-xs px-4 py-2 bg-linear-to-br from-green-100 to-green-200 text-green-600 rounded-lg ring-1 ring-green-300 hover:ring-green-400 transition"
                                >
                                    <DownloadIcon className="size-4" />
                                    Download
                                </Button>
                            </div>
                        </div>

                        {resumeData && (
                            <ResumePreview
                                data={resumeData}
                                template={resumeData.template}
                                accentColor={resumeData.accentColor}
                                classes=""
                            />
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
