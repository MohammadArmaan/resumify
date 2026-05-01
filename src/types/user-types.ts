export type User = {
    id: number;
    uuid: string;

    fullName: string;
    email: string;
    passwordHash: string;

    profilePhoto?: string;
    googleId: string;

    credits: number;
    isSubscribed: boolean;
    pricing: string;

    tokensRemaining: number;
    atsScoreChecks: number;
    jobDescriptionMatchings: number;
    coverLetterGenerations: number;

    emailVerified: boolean;

    updatedAt: Date;
    createdAt: Date;

}