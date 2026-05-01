// app/api/resume/title/[uuid]/route.ts
// UPDATE RESUME TITLE

import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";

import { db } from "@/config/db";
import { resumesTable } from "@/config/resumeSchema";
import { getUserFromRequest } from "@/lib/jwt";


export async function PATCH(req: NextRequest, context: { params: Promise<{ uuid: string }> },) {
    try {
        const user = await getUserFromRequest(req);

        if (!user) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { uuid } = await context.params;
        const body = await req.json();
        const title = body.title?.trim();

        if (!title) {
            return NextResponse.json(
                { success: false, message: "Title is required" },
                { status: 400 }
            );
        }

        const [resume] = await db
            .update(resumesTable)
            .set({
                title,
                updatedAt: new Date(),
            })
            .where(
                and(
                    eq(resumesTable.uuid, uuid),
                    eq(resumesTable.userId, user[0].id)
                )
            )
            .returning();

        if (!resume) {
            return NextResponse.json(
                { success: false, message: "Resume not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Resume title updated successfully",
            resume,
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { success: false, message: "Failed to update title" },
            { status: 500 }
        );
    }
}