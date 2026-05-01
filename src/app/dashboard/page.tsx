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
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogClose,
} from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateResume } from "@/hooks/mutations/resume/useCreateResume";
import { useDeleteResume } from "@/hooks/mutations/resume/useDeleteResume";
import { useUpdateResumeTitle } from "@/hooks/mutations/resume/useUpdateResumeTitle";
import { useUploadResume } from "@/hooks/mutations/resume/useUploadResume";
import { useResumeList } from "@/hooks/queries/resume/useResumeList";
import { useUser } from "@/hooks/queries/useUser";
import {
    Edit,
    FilePenIcon,
    PlusIcon,
    Trash2Icon,
    UploadCloud,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";

export default function DashboardPage() {
    const colors = ["#9333ea", "#d97706", "#dc2626", "#007bff", "#16a34a"];

    const [title, setTitle] = useState("");
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const { data: userData } = useUser();
    const isSubscribed = userData?.user?.isSubscribed;

    const { data: resumeListData } = useResumeList();
    const allResumes = resumeListData?.resumes ?? [];

    const createResume = useCreateResume();
    const deleteResume = useDeleteResume();
    const updateResumeTitle = useUpdateResumeTitle();
    const uploadResume = useUploadResume();

    function handleCreateResume() {
        createResume.mutate(
            { title },
            {
                onSuccess: (data) => {
                    toast.success("Resume Workspace Created");
                    setIsCreateOpen(false);
                    setTitle("");
                    router.push(`/dashboard/builder/${data.resume.uuid}`);
                },
                onError: (err) => {
                    const message = err instanceof Error ? err.message : "Failed to create resume";
                    toast.error(message);
                },
            }
        );
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    }

// replace old handleResumeUpload()

function handleResumeUpload() {
    if (!title.trim()) {
        toast.error(
            "Please enter resume title"
        );
        return;
    }

    if (!file) {
        toast.error(
            "Please choose a PDF file"
        );
        return;
    }

    uploadResume.mutate(
        {
            title,
            file,
        },
        {
            onSuccess: (data) => {
                toast.success(
                    "Resume uploaded successfully!"
                );

                setIsUploadOpen(false);
                setTitle("");
                setFile(null);

                router.push(
                    `/dashboard/builder/${data.resume.uuid}`
                );
            },

            onError: (err) => {
                const message =
                    err instanceof Error
                        ? err.message
                        : "Failed to upload resume";

                toast.error(message);
            },
        }
    );
}

    function handleUpdateResumeTitle() {
        if (!selectedResumeId) return;

        updateResumeTitle.mutate(
            { uuid: selectedResumeId, title },
            {
                onSuccess: () => {
                    toast.success("Resume Title Edited Successfully!");
                    setIsEditOpen(false);
                    setTitle("");
                    setSelectedResumeId(null);
                },
                onError: (err) => {
                    const message = err instanceof Error ? err.message : "Failed to update resume title";
                    toast.error(message);
                },
            }
        );
    }

    function handleDeleteResume() {
        if (!selectedResumeId) return;

        deleteResume.mutate(
            { uuid: selectedResumeId },
            {
                onSuccess: () => {
                    toast.success("Resume Deleted Successfully!");
                    setIsDeleteOpen(false);
                    setSelectedResumeId(null);
                },
                onError: (err) => {
                    const message = err instanceof Error ? err.message : "Failed to delete resume";
                    toast.error(message);
                },
            }
        );
    }

    function handleUploadButtonClick() {
        if (!isSubscribed) {
            toast.warning("Upgrade to Pro to upload existing resumes!", {
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

    return (
        <main className="min-h-screen container">
            <div className="flex gap-3">

                {/* Create Resume Dialog */}
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <button className="p-5 rounded-xl bg-linear-to-br from-green-100 to-green-400 flex items-center flex-col gap-2 border border-green-600 shadow-md  hover:border-dashed hover:shadow-2xl delay-300 text-white">
                            <PlusIcon className="transition-all bg-linear-to-br from-green-300 to-green-600 text-white rounded-xl" />
                            Create Resume
                        </button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="mx-auto font-bold text-xl">
                                Create your Resume
                            </DialogTitle>
                            <DialogDescription>
                                Create your custom AI enabled resumes with our
                                amazing templates
                            </DialogDescription>
                        </DialogHeader>
                        <FieldGroup>
                            <Label htmlFor="resume-title">Resume Title</Label>
                            <Input
                                type="text"
                                placeholder="Your Resume Title"
                                id="resume-title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="rounded-md"
                            />
                        </FieldGroup>
                        <div className="flex gap-2 w-full">
                            <DialogClose asChild className="flex-1">
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button
                                onClick={handleCreateResume}
                                className="flex-1"
                                disabled={createResume.isPending}
                            >
                                {createResume.isPending ? "Creating..." : "Create Resume"}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Upload Resume — gated behind subscription */}
                <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
                    <DialogTrigger asChild>
                        <button
                            className="p-5 flex items-center justify-center flex-col gap-2 bg-linear-to-br from-purple-100 rounded-xl delay-300 to-purple-400 text-white border border-purple-700 shadow-md hover:shadow-2xl hover:border-dashed"
                            onClick={handleUploadButtonClick}
                            disabled={uploadResume.isPending}
                        >
                            <UploadCloud className="bg-linear-to-br from-purple-300 to-purple-600 text-white transition-all rounded-xl p-1" />
                            {!uploadResume.isPending ?  "Upload Existing" : "Uploading..."}
                        </button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="mx-auto font-bold text-xl">
                                Upload Existing Resume
                            </DialogTitle>
                            <DialogDescription>
                                Upload your existing resume for easy resume
                                making process
                            </DialogDescription>
                        </DialogHeader>
                        <FieldGroup>
                            <Label htmlFor="upload-resume-title">Resume Title</Label>
                            <Input
                                type="text"
                                id="upload-resume-title"
                                placeholder="Your Resume Title"
                                className="rounded-md"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </FieldGroup>
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="p-20 border border-dashed hover:border-purple-600 rounded-md flex items-center gap-2 justify-center flex-col cursor-pointer transition"
                        >
                            <UploadCloud className="h-10 w-10 text-muted-foreground" />
                            <p className="font-medium">Choose Resume File</p>
                            <p className="text-sm text-muted-foreground">
                                {file?.name}
                            </p>
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
                                onClick={handleResumeUpload}
                                className="flex-1"
                            >
                                Upload Resume
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Resume List */}
            <div className="grid grid-cols-2 sm:flex flex-wrap gap-4 mt-20">
                {allResumes.map((resume, index) => {
                    const baseColor = colors[index % colors.length];

                    return (
                        <button
                            key={resume.uuid}
                            className="relative w-full sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 border group hover:shadow-lg transition-all duration-300 cursor-pointer"
                            style={{
                                background: `linear-gradient(135deg, ${baseColor}10, ${baseColor}40)`,
                                borderColor: baseColor + "40",
                            }}
                            onClick={() => router.push(`/dashboard/builder/${resume.uuid}`)}
                        >
                            <FilePenIcon
                                className="size-7 group-hover:scale-105 transition-all"
                                style={{ color: baseColor }}
                            />
                            <p
                                className="text-sm group-hover:scale-105 transition-all px-2 text-center"
                                style={{ color: baseColor }}
                            >
                                {resume.title}
                            </p>
                            <p
                                className="absolute bottom-1 text-[11px] text-slate-400 group-hover:text-slate-500 transition-all duration-300 px-2 text-center"
                                style={{ color: baseColor + "90" }}
                            >
                                Updated on{" "}
                                {new Date(resume.updatedAt).toLocaleDateString()}
                            </p>
                            <div className="absolute top-1 right-1 group-hover:flex items-center hidden">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedResumeId(resume.uuid);
                                        setTitle(resume.title);
                                        setIsEditOpen(true);
                                    }}
                                >
                                    <Edit className="size-7 p-1.5 text-slate-400 hover:bg-slate-600 rounded transition-colors" />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedResumeId(resume.uuid);
                                        setIsDeleteOpen(true);
                                    }}
                                >
                                    <Trash2Icon className="size-7 p-1.5 transition-colors text-slate-400 hover:bg-slate-600 rounded" />
                                </button>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Edit Resume Title Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent aria-describedby="Resume Title">
                    <DialogHeader>
                        <DialogTitle className="font-bold text-xl mx-auto">
                            Edit Resume Title
                        </DialogTitle>
                    </DialogHeader>
                    <FieldGroup>
                        <Label htmlFor="edit-resume-title">Edit Resume Title</Label>
                        <Input
                            id="edit-resume-title"
                            placeholder="Edit Resume Title"
                            className="rounded-md"
                            onChange={(e) => setTitle(e.target.value)}
                            value={title}
                        />
                    </FieldGroup>
                    <div className="flex gap-2 w-full">
                        <DialogClose asChild className="flex-1">
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button
                            onClick={handleUpdateResumeTitle}
                            className="flex-1"
                            disabled={updateResumeTitle.isPending}
                        >
                            {updateResumeTitle.isPending ? "Saving..." : "Edit Resume Title"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Resume Alert */}
            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This action can&apos;t be undone. This will
                            permanently delete your resume from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="flex gap-2 w-full">
                        <AlertDialogCancel className="flex-1">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteResume}
                            variant={"destructive"}
                            className="flex-1"
                            disabled={deleteResume.isPending}
                        >
                            {deleteResume.isPending ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </div>
                </AlertDialogContent>
            </AlertDialog>
        </main>
    );
}