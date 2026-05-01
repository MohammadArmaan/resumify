// app/api/ai-report/upload/route.ts

import { NextRequest, NextResponse } from "next/server";
import { extractText, getDocumentProxy } from "unpdf";
import { db } from "@/config/db";
import { getUserFromRequest } from "@/lib/jwt";
import { aiReportsTable } from "@/config/aiReportSchema";

export async function POST(req: NextRequest) {
    try {
        const auth = await getUserFromRequest(req);
        if (!auth) {
            return NextResponse.json({ success: false }, { status: 401 });
        }

        const userId = auth[0].id;

        const { title, pdfUrl } = await req.json();

        if (!pdfUrl) {
            return NextResponse.json(
                { success: false, message: "pdfUrl required" },
                { status: 400 }
            );
        }

        // ✅ fetch file from URL (server-side)
        const fileRes = await fetch(pdfUrl);
        const buffer = await fileRes.arrayBuffer();

        const pdf = await getDocumentProxy(new Uint8Array(buffer));
        const { text } = await extractText(pdf, { mergePages: true });

        const resumeText = text
            .replace(/\s+/g, " ")
            .trim()
            .slice(0, 12000);

        const uuid = crypto.randomUUID();

        const [report] = await db
            .insert(aiReportsTable)
            .values({
                uuid,
                userId,
                title,
                type: "ATS",
                resumeSnapshot: resumeText,
                pdfUrl,
                result: {},
            })
            .returning();

        return NextResponse.json({
            success: true,
            report,
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { success: false, message: "Upload failed" },
            { status: 500 }
        );
    }
}