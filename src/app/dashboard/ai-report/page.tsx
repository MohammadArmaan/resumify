"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogClose,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAiReportList } from "@/hooks/queries/ai-report/useAiReportList";
import { useDeleteAiReport } from "@/hooks/queries/ai-report/useDeleteAiReport";
import { useUpdateAiReportTitle } from "@/hooks/queries/ai-report/useUpdateAiReportTitle";
import { useUploadAiReport } from "@/hooks/queries/ai-report/useUploadAiReport";
import { useUser } from "@/hooks/queries/useUser";
import {
    Edit,
    FileSearch,
    Trash2Icon,
    UploadCloud,
    Lock,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";

export default function AiReportDashboardPage() {
    const colors = ["#16a34a", "#2563eb", "#d97706", "#dc2626", "#9333ea"];

    const [title, setTitle] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedUuid, setSelectedUuid] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const { data: userData } = useUser();
    const isSubscribed = userData?.user?.isSubscribed;

    const { data: reportListData } = useAiReportList();
    const allReports = reportListData?.reports ?? [];

    const uploadReport = useUploadAiReport();
    const updateTitle = useUpdateAiReportTitle();
    const deleteReport = useDeleteAiReport();

    // ── Handlers ──────────────────────────────────────────────────────────────

    function handleUploadButtonClick() {
        if (!isSubscribed) {
            toast.warning("Upgrade to Pro to use AI Resume Analysis!", {
                description: "Subscribe to unlock this feature and more.",
                action: {
                    label: "Buy Subscription",
                    onClick: () => router.push("/pricing"),
                },
            });
            return;
        }
        setIsUploadOpen(true);
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const selected = e.target.files?.[0];
        if (selected) setFile(selected);
    }

    function handleUpload() {
        if (!title.trim()) {
            toast.error("Please enter a report title");
            return;
        }
        if (!file) {
            toast.error("Please choose a PDF file");
            return;
        }

        uploadReport.mutate(
            { title, file },
            {
                onSuccess: (data) => {
                    toast.success("Resume uploaded — running AI analysis…");
                    setIsUploadOpen(false);
                    setTitle("");
                    setFile(null);
                    router.push(`/dashboard/ai-report/${data.report.uuid}`);
                },
                onError: (err) => {
                    toast.error(err instanceof Error ? err.message : "Upload failed");
                },
            }
        );
    }

    function handleUpdateTitle() {
        if (!selectedUuid) return;
        updateTitle.mutate(
            { uuid: selectedUuid, title },
            {
                onSuccess: () => {
                    toast.success("Report renamed successfully");
                    setIsEditOpen(false);
                    setTitle("");
                    setSelectedUuid(null);
                },
                onError: (err) => {
                    toast.error(err instanceof Error ? err.message : "Failed to rename report");
                },
            }
        );
    }

    function handleDelete() {
        if (!selectedUuid) return;
        deleteReport.mutate(
            { uuid: selectedUuid },
            {
                onSuccess: () => {
                    toast.success("Report deleted");
                    setIsDeleteOpen(false);
                    setSelectedUuid(null);
                },
                onError: (err) => {
                    toast.error(err instanceof Error ? err.message : "Failed to delete report");
                },
            }
        );
    }

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <main className="min-h-screen container">

            {/* ── Action strip ── */}
            <div className="flex gap-3">

                {/* Upload button — gated */}
                <button
                    onClick={handleUploadButtonClick}
                    disabled={uploadReport.isPending}
                    className="p-5 flex items-center justify-center flex-col gap-2
                        bg-linear-to-br from-green-100 to-green-400
                        dark:from-green-900/50 dark:to-green-800/50
                        rounded-xl border border-green-600 dark:border-green-700
                        shadow-md hover:shadow-2xl hover:border-dashed
                        transition-all delay-75 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubscribed ? (
                        <UploadCloud className="bg-linear-to-br from-green-300 to-green-600 text-white rounded-xl p-1 size-6" />
                    ) : (
                        <Lock className="bg-linear-to-br from-green-300 to-green-600 text-white rounded-xl p-1 size-6" />
                    )}
                    <span className="text-sm font-medium text-green-800 dark:text-green-300">
                        {uploadReport.isPending ? "Uploading…" : "Analyze Resume"}
                    </span>
                </button>
            </div>

            {/* ── Report grid ── */}
            <div className="grid grid-cols-2 sm:flex flex-wrap gap-4 mt-20">
                {allReports.map((report, index) => {
                    const baseColor = colors[index % colors.length];

                    return (
                        <button
                            key={report.uuid}
                            className="relative w-full sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 border group hover:shadow-lg transition-all duration-300 cursor-pointer"
                            style={{
                                background: `linear-gradient(135deg, ${baseColor}10, ${baseColor}40)`,
                                borderColor: baseColor + "40",
                            }}
                            onClick={() => router.push(`/dashboard/ai-report/${report.uuid}`)}
                        >
                            <FileSearch
                                className="size-7 group-hover:scale-105 transition-all"
                                style={{ color: baseColor }}
                            />
                            <p
                                className="text-sm group-hover:scale-105 transition-all px-2 text-center font-medium"
                                style={{ color: baseColor }}
                            >
                                {report.title}
                            </p>
                            <p
                                className="absolute bottom-1 text-[11px] transition-all duration-300 px-2 text-center"
                                style={{ color: baseColor + "90" }}
                            >
                                Updated {new Date(report.updatedAt).toLocaleDateString()}
                            </p>

                            {/* Edit / Delete — visible on hover */}
                            <div className="absolute top-1 right-1 group-hover:flex items-center hidden">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedUuid(report.uuid);
                                        setTitle(report.title);
                                        setIsEditOpen(true);
                                    }}
                                >
                                    <Edit className="size-7 p-1.5 text-slate-400 hover:bg-slate-600 rounded transition-colors" />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedUuid(report.uuid);
                                        setIsDeleteOpen(true);
                                    }}
                                >
                                    <Trash2Icon className="size-7 p-1.5 text-slate-400 hover:bg-slate-600 rounded transition-colors" />
                                </button>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* ── Upload dialog ── */}
            <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="mx-auto font-bold text-xl">
                            Analyze Your Resume
                        </DialogTitle>
                        <DialogDescription>
                            Upload your resume PDF and we&apos;ll run a full AI analysis — ATS score, job match, and more.
                        </DialogDescription>
                    </DialogHeader>

                    <FieldGroup>
                        <Label htmlFor="report-title">Report Title</Label>
                        <Input
                            type="text"
                            id="report-title"
                            placeholder="e.g. Google SWE Application"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="rounded-md"
                        />
                    </FieldGroup>

                    {/* Drop zone */}
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="p-14 border border-dashed hover:border-green-600 dark:hover:border-green-500 rounded-md flex items-center gap-2 justify-center flex-col cursor-pointer transition-colors"
                    >
                        <UploadCloud className="h-8 w-8 text-muted-foreground" />
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {file ? file.name : "Click to choose a PDF"}
                        </p>
                        <p className="text-xs text-muted-foreground">PDF only</p>
                        <Input
                            type="file"
                            hidden
                            ref={fileInputRef}
                            accept=".pdf,application/pdf"
                            onChange={handleFileChange}
                        />
                    </div>

                    <div className="flex gap-2 w-full">
                        <DialogClose asChild className="flex-1">
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button
                            onClick={handleUpload}
                            className="flex-1"
                            disabled={uploadReport.isPending}
                        >
                            {uploadReport.isPending ? "Uploading…" : "Upload & Analyze"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* ── Edit title dialog ── */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="font-bold text-xl mx-auto">
                            Rename Report
                        </DialogTitle>
                    </DialogHeader>
                    <FieldGroup>
                        <Label htmlFor="edit-report-title">New Title</Label>
                        <Input
                            id="edit-report-title"
                            placeholder="Report title"
                            className="rounded-md"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </FieldGroup>
                    <div className="flex gap-2 w-full">
                        <DialogClose asChild className="flex-1">
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button
                            onClick={handleUpdateTitle}
                            className="flex-1"
                            disabled={updateTitle.isPending}
                        >
                            {updateTitle.isPending ? "Saving…" : "Save"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* ── Delete confirm ── */}
            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete this report?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action can&apos;t be undone. The AI report will be permanently removed.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="flex gap-2 w-full">
                        <AlertDialogCancel className="flex-1">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            variant="destructive"
                            className="flex-1"
                            disabled={deleteReport.isPending}
                        >
                            {deleteReport.isPending ? "Deleting…" : "Delete"}
                        </AlertDialogAction>
                    </div>
                </AlertDialogContent>
            </AlertDialog>
        </main>
    );
}