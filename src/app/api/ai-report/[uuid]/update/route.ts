// app/api/ai-report/[uuid]/update/route.ts

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

        const body = await req.json();

        // Allowed fields only (IMPORTANT)
        const allowedUpdates: Partial<{
            jobDescription: string;
            company: string;
            role: string;
            result: any;
            pdfUrl: string;
        }> = {};

        if (body.jobDescription !== undefined)
            allowedUpdates.jobDescription = body.jobDescription;

        if (body.company !== undefined) allowedUpdates.company = body.company;

        if (body.role !== undefined) allowedUpdates.role = body.role;

        if (body.result !== undefined) allowedUpdates.result = body.result;

        if (body.pdfUrl !== undefined) allowedUpdates.pdfUrl = body.pdfUrl;

        if (Object.keys(allowedUpdates).length === 0) {
            return NextResponse.json(
                { success: false, message: "No valid fields to update" },
                { status: 400 },
            );
        }

        const [updated] = await db
            .update(aiReportsTable)
            .set({
                ...allowedUpdates,
                updatedAt: new Date(),
            })
            .where(
                and(
                    eq(aiReportsTable.uuid, uuid),
                    eq(aiReportsTable.userId, auth[0].id),
                ),
            )
            .returning();

        if (!updated) {
            return NextResponse.json(
                { success: false, message: "Report not found" },
                { status: 404 },
            );
        }

        return NextResponse.json({
            success: true,
            report: updated,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { success: false, message: "Failed to update report" },
            { status: 500 },
        );
    }
}
