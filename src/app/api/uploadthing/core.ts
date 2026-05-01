import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
    imageUploader: f({
        image: {
            maxFileSize: "4MB",
            maxFileCount: 1,
        },
    })
        .middleware(async () => {
            return {}; // ✅ no auth here
        })
        .onUploadComplete(async ({ file }) => {
            return {
                url: file.url,
            };
        }),

    resumeUploader: f({
        pdf: {
            maxFileSize: "8MB",
            maxFileCount: 1,
        },
    })
        .middleware(async () => {
            return {}; // ✅ FIXED
        })
        .onUploadComplete(async ({ file }) => {
            return {
                url: file.url,
                name: file.name,
            };
        }),
} satisfies FileRouter;