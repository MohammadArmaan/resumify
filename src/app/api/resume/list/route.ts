// app/api/resume/list/route.ts
// GET USER RESUME LIST

import { NextRequest, NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";

import { db } from "@/config/db";
import { resumesTable } from "@/config/resumeSchema";
import { getUserFromRequest } from "@/lib/jwt";

export async function GET(req: NextRequest) {
    try {
        const user = await getUserFromRequest(req);

        if (!user) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const resumes = await db
            .select({
                id: resumesTable.id,
                uuid: resumesTable.uuid,
                title: resumesTable.title,
                updatedAt: resumesTable.updatedAt,
                createdAt: resumesTable.createdAt,
                public: resumesTable.public,
            })
            .from(resumesTable)
            .where(eq(resumesTable.userId, user[0].id))
            .orderBy(desc(resumesTable.updatedAt));

        return NextResponse.json({
            success: true,
            resumes,
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { success: false, message: "Failed to fetch resumes" },
            { status: 500 }
        );
    }
}