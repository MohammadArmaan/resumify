// lib/ai/guard.ts

import { eq } from "drizzle-orm";
import { db } from "@/config/db";
import { usersTable } from "@/config/userSchema";

type FeatureType =
    | "ats"
    | "jobMatch"
    | "coverLetter"
    | "general";

export async function getVerifiedAiUser(
    userId: number,
    feature: FeatureType = "general"
) {
    const [user] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, userId))
        .limit(1);

    if (!user) {
        throw new Error("User not found");
    }

    if (!user.isSubscribed) {
        throw new Error("Subscription required");
    }

    if (user. tokensRemaining && user.tokensRemaining <= 0) {
        throw new Error("No AI tokens remaining");
    }

    if (
        feature === "ats" &&
        user.atsScoreChecks && user.atsScoreChecks <= 0
    ) {
        throw new Error(
            "ATS score checks exhausted"
        );
    }

    if (
        feature === "jobMatch" &&
        user.jobDescriptionMatchings && user.jobDescriptionMatchings <= 0
    ) {
        throw new Error(
            "Job description match quota exhausted"
        );
    }

    if (
        feature === "coverLetter" &&
        user.coverLetterGenerations && user.coverLetterGenerations <= 0
    ) {
        throw new Error(
            "Cover letter quota exhausted"
        );
    }

    return user;
}