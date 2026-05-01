// app/api/resume/[uuid]/route.ts
// UPDATE RESUME / DELETE RESUME

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
            title: body.title,
            public: body.public,
            personalInfo: body.personalInfo,
            professionalSummary: body.professionalSummary,
            skills: body.skills,
            experience: body.experience,
            education: body.education,
            project: body.project,
            template: body.template,
            accentColor: body.accentColor,
            updatedAt: new Date(),
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
            message: "Resume updated successfully",
            resume,
        });
    } catch (error) {
        console.error("UPDATE RESUME ERROR:", error);

        return NextResponse.json(
            { success: false, message: "Failed to update resume" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: NextRequest,
    context: { params: Promise<{ uuid: string }> },
) {
    try {
        const user = await getUserFromRequest(req);

        if (!user) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 },
            );
        }

        const { uuid } = await context.params;

        const [resume] = await db
            .delete(resumesTable)
            .where(
                and(
                    eq(resumesTable.uuid, uuid),
                    eq(resumesTable.userId, user[0].id),
                ),
            )
            .returning();

        if (!resume) {
            return NextResponse.json(
                { success: false, message: "Resume not found" },
                { status: 404 },
            );
        }

        return NextResponse.json({
            success: true,
            message: "Resume deleted successfully",
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { success: false, message: "Failed to delete resume" },
            { status: 500 },
        );
    }
}
