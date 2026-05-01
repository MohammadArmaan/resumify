// app/api/resume/[uuid]/view/route.ts
// GET FULL RESUME DATA BY UUID (OWNER ONLY)

import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";

import { db } from "@/config/db";
import { resumesTable } from "@/config/resumeSchema";
import { getUserFromRequest } from "@/lib/jwt";


export async function GET(
    req: NextRequest,
    context: { params: Promise<{ uuid: string }> },
) {
    try {
        const user = await getUserFromRequest(req);

        if (!user) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { uuid } = await context.params;

        const [resume] = await db
            .select()
            .from(resumesTable)
            .where(
                and(
                    eq(resumesTable.uuid, uuid),
                    eq(resumesTable.userId, user[0].id)
                )
            )
            .limit(1);

        if (!resume) {
            return NextResponse.json(
                { success: false, message: "Resume not found" },
                { status: 404 }
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
            { status: 500 }
        );
    }
}