// app/api/resume/route.ts

import { NextRequest, NextResponse } from "next/server";
import { and, eq, sql } from "drizzle-orm";

import { db } from "@/config/db";
import { usersTable } from "@/config/userSchema";
import { resumesTable } from "@/config/resumeSchema";
import { getUserFromRequest } from "@/lib/jwt";

export async function POST(req: NextRequest) {
    try {
        const user = await getUserFromRequest(req);

        if (!user) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await req.json();
        const title = body.title?.trim();

        if (!title) {
            return NextResponse.json(
                { success: false, message: "Resume title is required" },
                { status: 400 }
            );
        }

        const userId = user[0].id;
        const uuid = crypto.randomUUID();

        // 🔥 1. Deduct credit FIRST (atomic + safe)
        const updated = await db
            .update(usersTable)
            .set({
                credits: sql`${usersTable.credits} - 1`,
            })
            .where(
                and(
                    eq(usersTable.id, userId),
                    sql`${usersTable.credits} > 0`
                )
            )
            .returning();

        if (!updated.length) {
            return NextResponse.json(
                {
                    success: false,
                    message: "No credits left to create resume",
                },
                { status: 403 }
            );
        }

        // 🔥 2. Create resume
        let createdResume;

        try {
            [createdResume] = await db
                .insert(resumesTable)
                .values({
                    uuid,
                    userId,
                    title,
                    personalInfo: {
                        fullName: "",
                        email: "",
                    },
                })
                .returning();
        } catch (err) {
            // 🔁 refund ONLY if insert fails
            await db
                .update(usersTable)
                .set({
                    credits: sql`${usersTable.credits} + 1`,
                })
                .where(eq(usersTable.id, userId));

            throw err;
        }

        return NextResponse.json({
            success: true,
            message: "Resume created successfully",
            resume: createdResume,
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to create resume",
            },
            { status: 500 }
        );
    }
}