// app/api/ai-report/create/route.ts

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/db";
import { getUserFromRequest } from "@/lib/jwt";
import { aiReportsTable } from "@/config/aiReportSchema";

export async function POST(req: NextRequest) {
    try {
        const auth = await getUserFromRequest(req);

        if (!auth) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const {
            title,
            type,
            jobDescription,
            company,
            role,
            resumeSnapshot,
            result,
        } = await req.json();

        if (!title || !type || !resumeSnapshot || !result) {
            return NextResponse.json(
                { success: false, message: "Missing required fields" },
                { status: 400 }
            );
        }

        const [report] = await db
            .insert(aiReportsTable)
            .values({
                userId: auth[0].id,
                title,
                type,
                jobDescription,
                company,
                role,
                resumeSnapshot,
                result,
            })
            .returning();

        return NextResponse.json({
            success: true,
            report,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { success: false, message: "Failed to create report" },
            { status: 500 }
        );
    }
}