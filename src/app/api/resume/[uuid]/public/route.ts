// app/api/resume/[uuid]/public/route.ts

import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";

import { db } from "@/config/db";
import { resumesTable } from "@/config/resumeSchema";
import { getUserFromRequest } from "@/lib/jwt";

export async function PATCH(
    req: NextRequest,
    context: { params: Promise<{ uuid: string }> }
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
        const body = await req.json();

        const updateData = {
            public: body.public,

        };

        const [resume] = await db
            .update(resumesTable)
            .set(updateData)
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
            message: "Resume is available to public",
            resume,
        });
    } catch (error) {
        console.error("UPDATE PUBLIC ERROR:", error);

        return NextResponse.json(
            { success: false, message: "Failed to update resume" },
            { status: 500 }
        );
    }
}

