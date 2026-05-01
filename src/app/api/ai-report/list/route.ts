// app/api/ai-report/list/route.ts

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/db";
import { eq, desc } from "drizzle-orm";
import { getUserFromRequest } from "@/lib/jwt";
import { aiReportsTable } from "@/config/aiReportSchema";

export async function GET(req: NextRequest) {
    try {
        const auth = await getUserFromRequest(req);

        if (!auth) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const reports = await db
            .select({
                uuid: aiReportsTable.uuid,
                title: aiReportsTable.title,
                updatedAt: aiReportsTable.updatedAt,
            })
            .from(aiReportsTable)
            .where(eq(aiReportsTable.userId, auth[0].id))
            .orderBy(desc(aiReportsTable.updatedAt));

        return NextResponse.json({
            success: true,
            reports,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch reports" },
            { status: 500 }
        );
    }
}