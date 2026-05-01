// app/api/ai-report/[uuid]/update-title/route.ts

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/db";
import { eq, and } from "drizzle-orm";
import { getUserFromRequest } from "@/lib/jwt";
import { aiReportsTable } from "@/config/aiReportSchema";

export async function PATCH(
    req: NextRequest,
    context: { params: Promise<{ uuid: string }> },
) {
    try {
        const { uuid } = await context.params;

        const auth = await getUserFromRequest(req);

        if (!auth) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 },
            );
        }

        const { title } = await req.json();

        if (!title) {
            return NextResponse.json(
                { success: false, message: "Title is required" },
                { status: 400 },
            );
        }

        const [updated] = await db
            .update(aiReportsTable)
            .set({
                title,
                updatedAt: new Date(),
            })
            .where(
                and(
                    eq(aiReportsTable.uuid, uuid),
                    eq(aiReportsTable.userId, auth[0].id),
                ),
            )
            .returning();

        return NextResponse.json({
            success: true,
            report: updated,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { success: false, message: "Failed to update title" },
            { status: 500 },
        );
    }
}
