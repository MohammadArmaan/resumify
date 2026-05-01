import { ResumeData } from "./resume-types";

/* Enhance Description */

export type EnhanceDescriptionInput = {
    text: string;
};

export type EnhanceDescriptionResponse = {
    success: boolean;
    enhancedText: string;
    tokensUsed: number;
};

/* ATS Score */

export type AtsScoreInput = {
    resumeText: string;
    jobDescription: string;
};

export type AtsScoreResult = {
    score: number;
    missingKeywords: string[];
    suggestions: string[];
};

export type AtsScoreResponse = {
    success: boolean;
    data: AtsScoreResult;
    tokensUsed: number;
};

/* Job Match */

export type JobMatchInput = {
    resumeText: string;
    jobDescription: string;
};

export type JobMatchResult = {
    matchScore: number;
    strengths: string[];
    gaps: string[];
    suggestions?: string[];
};

export type JobMatchResponse = {
    success: boolean;
    data: JobMatchResult;
    tokensUsed: number;
};

/* Cover Letter */

export type CoverLetterInput = {
    company: string;
    role: string;
    resumeSummary: string;
};

export type CoverLetterResponse = {
    success: boolean;
    coverLetter: string;
    tokensUsed: number;
};

/* Parse Resume */

export type ParseResumeInput = {
    resumeText: string;
};

export type ParseResumeResponse = {
    success: boolean;
    data: Partial<ResumeData>;
    tokensUsed: number;
};

export type AIReportType = "ATS" | "JOB_MATCH" | "COVER_LETTER";

export type AIReportResult =
    | {
          type: "ATS";
          data: {
              score: number;
              missingKeywords: string[];
              suggestions: string[];
          };
      }
    | {
          type: "JOB_MATCH";
          data: {
              matchScore: number;
              strengths: string[];
              gaps: string[];
          };
      }
    | {
          type: "COVER_LETTER";
          data: {
              coverLetter: string;
          };
      };
