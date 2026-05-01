// src/types/upload-resume-types.ts

import { ResumeData } from "./resume-types";

export type UploadResumeInput = {
    title: string;
    file: File;
};

export type UploadResumeResponse = {
    success: boolean;
    message: string;
    resume: ResumeData;
};