import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/db";
import { subscriptionTable } from "@/config/subscriptionSchema";
import { usersTable } from "@/config/userSchema";
import { desc, eq } from "drizzle-orm";
import { getUserFromRequest } from "@/lib/jwt";
import { PLAN_LIMITS } from "@/lib/subscriptionPricing";

export async function GET(req: NextRequest) {
    try {
        /* -------- AUTH -------- */
        const user = await getUserFromRequest(req);

        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );
        }

        const userId = user[0].id;

        /* -------- FETCH LATEST SUB -------- */
        const [subscription] = await db
            .select()
            .from(subscriptionTable)
            .where(eq(subscriptionTable.userId, userId))
            .orderBy(desc(subscriptionTable.endDate))
            .limit(1);

        /* -------- NO SUB -------- */
        if (!subscription) {
            // ensure user is reset
            await db
                .update(usersTable)
                .set({
                    isSubscribed: false,
                    credits: 0,
                    atsScoreChecks: 0,
                    jobDescriptionMatchings: 0,
                    coverLetterGenerations: 0,
                    tokensRemaining: 0,
                })
                .where(eq(usersTable.id, userId));

            return NextResponse.json({
                isSubscribed: false,
                plan: null,
                pricing: null,
                expiry: null,
            });
        }

        const now = new Date();

        const isActive =
            subscription.status === "ACTIVE" &&
            new Date(subscription.endDate) > now;

        /* -------- HANDLE ACTIVE -------- */
        if (isActive) {
            const limits = PLAN_LIMITS[subscription.pricing];

            // Sync user limits (important if user refreshed / new login)
            await db
                .update(usersTable)
                .set({
                    isSubscribed: true,
                    credits: limits.credits,
                    atsScoreChecks: limits.ats,
                    jobDescriptionMatchings: limits.jd,
                    coverLetterGenerations: limits.coverLetter,
                    tokensRemaining: limits.tokens,
                })
                .where(eq(usersTable.id, userId));

            return NextResponse.json({
                isSubscribed: true,
                plan: subscription.plan,
                pricing: subscription.pricing,
                expiry: subscription.endDate,
                credits: limits.credits,
                atsScoreChecks: limits.ats,
                jobDescriptionMatchings: limits.jd,
                coverLetterGenerations: limits.coverLetter,
                tokensRemainig: limits.tokens,
            });
        }

        /* -------- HANDLE EXPIRED -------- */
        // update subscription status if needed
        if (subscription.status === "ACTIVE") {
            await db
                .update(subscriptionTable)
                .set({ status: "EXPIRED" })
                .where(eq(subscriptionTable.id, subscription.id));
        }

        // reset user
        await db
            .update(usersTable)
            .set({
                isSubscribed: false,
                credits: 0,
                atsScoreChecks: 0,
                jobDescriptionMatchings: 0,
                coverLetterGenerations: 0,
                tokensRemaining: 0,
            })
            .where(eq(usersTable.id, userId));

        return NextResponse.json({
            isSubscribed: false,
            plan: null,
            pricing: null,
            expiry: subscription.endDate,
        });
    } catch (err) {
        console.error("Subscription status error:", err);

        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}
