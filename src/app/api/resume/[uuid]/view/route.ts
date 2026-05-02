// app/api/resume/[uuid]/view/route.ts

import { NextRequest, NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";

import { db } from "@/config/db";
import { resumesTable } from "@/config/resumeSchema";

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ uuid: string }> },
) {
    try {
        const { uuid } = await context.params;

        const [resume] = await db
            .select()
            .from(resumesTable)
            .where(
                and(
                    eq(resumesTable.uuid, uuid),
                    eq(resumesTable.public, true), // 🔥 only public resumes
                ),
            )
            .limit(1);

        if (!resume) {
            return NextResponse.json(
                { success: false, message: "Resume not found or not public" },
                { status: 404 },
            );
        }

        return NextResponse.json({
            success: true,
            resume,
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { success: false, message: "Failed to fetch resume" },
            { status: 500 },
        );
    }
}
