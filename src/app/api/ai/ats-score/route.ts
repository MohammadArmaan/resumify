// app/api/ai/ats-score/route.ts

import { NextRequest, NextResponse } from "next/server";
import { and, eq, sql } from "drizzle-orm";

import { flashModel } from "@/lib/ai/gemini";
import { estimateTokens } from "@/lib/ai/tokens";
import { getVerifiedAiUser } from "@/lib/ai/guard";
import { getUserFromRequest } from "@/lib/jwt";
import { db } from "@/config/db";
import { usersTable } from "@/config/userSchema";
import { parseAIJson } from "@/lib/parseAIJson";

export async function POST(req: NextRequest) {
    try {
        const auth = await getUserFromRequest(req);

        if (!auth) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 },
            );
        }

        const { resumeText, jobDescription } = await req.json();

        const user = await getVerifiedAiUser(auth[0].id, "ats");

        const prompt = `
You are a senior ATS (Applicant Tracking System) specialist and technical recruiter who has screened thousands of resumes.

Analyze the resume against the job description for ATS compatibility and keyword alignment.

Scoring criteria:
- Keyword match rate between resume and job description (40%)
- Presence of measurable achievements (20%)
- Formatting and structure clarity (20%)
- Skills and tools alignment (20%)

Return ONLY a valid JSON object with no markdown, no code blocks, no extra text:
{
  "score": <number 0–100>,
  "missingKeywords": [<high-priority keywords from the job description absent in the resume>],
  "suggestions": [<specific, actionable improvements the candidate can make>]
}

Resume:
${resumeText}

Job Description:
${jobDescription}
`;

        const result = await flashModel.generateContent(prompt);
        const output = result.response.text();

        const used =
            estimateTokens(resumeText) +
            estimateTokens(jobDescription) +
            estimateTokens(output);

        const updated = await db
            .update(usersTable)
            .set({
                tokensRemaining: sql`${usersTable.tokensRemaining} - ${used}`,
                atsScoreChecks: sql`${usersTable.atsScoreChecks} - 1`,
            })
            .where(
                and(
                    eq(usersTable.id, user.id),
                    sql`${usersTable.tokensRemaining} >= ${used}`,
                    sql`${usersTable.atsScoreChecks} > 0`,
                ),
            )
            .returning();

        if (!updated.length) {
            throw new Error("Insufficient tokens or ATS checks exhausted");
        }

        const parsed = parseAIJson(output);

        return NextResponse.json({
            success: true,
            data: parsed,
            tokensUsed: used,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                success: false,
                message: "Internal Server Error!",
            },
            { status: 500 },
        );
    }
}
