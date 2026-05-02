import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/db";
import { subscriptionTable } from "@/config/subscriptionSchema";
import { usersTable } from "@/config/userSchema";
import { desc, eq } from "drizzle-orm";
import { getUserFromRequest } from "@/lib/jwt";
import { PLAN_LIMITS } from "@/lib/subscriptionPricing";

function getCurrentCycleStart(startDate: Date, now: Date): Date {
    const msIn30Days = 30 * 24 * 60 * 60 * 1000;
    const elapsed = now.getTime() - startDate.getTime();
    const cyclesPassed = Math.floor(elapsed / msIn30Days);
    return new Date(startDate.getTime() + cyclesPassed * msIn30Days);
}

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

        /* -------- FETCH USER + LATEST SUB -------- */
        const [currentUser] = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.id, userId))
            .limit(1);

        const [subscription] = await db
            .select()
            .from(subscriptionTable)
            .where(eq(subscriptionTable.userId, userId))
            .orderBy(desc(subscriptionTable.endDate))
            .limit(1);

        /* -------- NO SUB -------- */
        if (!subscription) {
            await db
                .update(usersTable)
                .set({
                    isSubscribed: false,
                    credits: 0,
                    atsScoreChecks: 0,
                    jobDescriptionMatchings: 0,
                    coverLetterGenerations: 0,
                    tokensRemaining: 0,
                    updatedAt: new Date(),
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

            // Calculate current 30-day cycle start from subscription startDate
            const currentCycleStart = getCurrentCycleStart(
                new Date(subscription.startDate),
                now,
            );

            // updatedAt tells us when credits were last reset
            const lastReset = currentUser.updatedAt
                ? new Date(currentUser.updatedAt)
                : null;

            // Only reset if updatedAt is before the current cycle started
            // meaning credits haven't been refreshed yet this cycle
            const shouldReset =
                !lastReset || lastReset < currentCycleStart;

            if (shouldReset) {
                await db
                    .update(usersTable)
                    .set({
                        isSubscribed: true,
                        credits: limits.credits,
                        atsScoreChecks: limits.ats,
                        jobDescriptionMatchings: limits.jd,
                        coverLetterGenerations: limits.coverLetter,
                        tokensRemaining: limits.tokens,
                        updatedAt: now, // <-- marks when this cycle's reset happened
                    })
                    .where(eq(usersTable.id, userId));
            } else {
                // Don't touch credits — just ensure isSubscribed flag is correct
                await db
                    .update(usersTable)
                    .set({ isSubscribed: true })
                    .where(eq(usersTable.id, userId));
            }

            return NextResponse.json({
                isSubscribed: true,
                plan: subscription.plan,
                pricing: subscription.pricing,
                expiry: subscription.endDate,
                credits: shouldReset ? limits.credits : currentUser.credits,
                atsScoreChecks: shouldReset ? limits.ats : currentUser.atsScoreChecks,
                jobDescriptionMatchings: shouldReset ? limits.jd : currentUser.jobDescriptionMatchings,
                coverLetterGenerations: shouldReset ? limits.coverLetter : currentUser.coverLetterGenerations,
                tokensRemaining: shouldReset ? limits.tokens : currentUser.tokensRemaining,
            });
        }

        /* -------- HANDLE EXPIRED -------- */
        if (subscription.status === "ACTIVE") {
            await db
                .update(subscriptionTable)
                .set({ status: "EXPIRED" })
                .where(eq(subscriptionTable.id, subscription.id));
        }

        await db
            .update(usersTable)
            .set({
                isSubscribed: false,
                credits: 0,
                atsScoreChecks: 0,
                jobDescriptionMatchings: 0,
                coverLetterGenerations: 0,
                tokensRemaining: 0,
                updatedAt: now,
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