"use client";

import { UploadButton } from "@/lib/uploadthing";
import { toast } from "sonner";

export function ProfileImageUpload({
    onUpload,
}: {
    onUpload: (url: string) => void;
}) {
    return (
        <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
                const url = res?.[0]?.url;

                if (!url) {
                    toast.error("Upload failed");
                    return;
                }

                toast.success("Image uploaded!");
                onUpload(url);
            }}
            onUploadError={(error: Error) => {
                toast.error(error.message);
            }}
            appearance={{
                button:
                    "bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-lg",
            }}
        />
    );
}