// app/api/ai/job-match/route.ts

import { NextRequest, NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";

import { flashModel } from "@/lib/ai/gemini";
import { estimateTokens } from "@/lib/ai/tokens";
import { getVerifiedAiUser } from "@/lib/ai/guard";
import { getUserFromRequest } from "@/lib/jwt";
import { db } from "@/config/db";
import { usersTable } from "@/config/userSchema";

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

        const user = await getVerifiedAiUser(auth[0].id, "jobMatch");

        const prompt = `
You are an experienced technical recruiter and hiring manager who has evaluated thousands of candidate profiles.

Perform a deep comparison between the resume and the job description. Identify how well the candidate is positioned for this specific role.

Evaluation criteria:
- Required skills and tools coverage
- Years of experience alignment
- Domain/industry relevance
- Achievement quality relative to role expectations
- Education and certification fit (if specified)

Return ONLY a valid JSON object with no markdown, no code blocks, no extra text:
{
  "matchScore": <number 0–100>,
  "strengths": [<specific areas where the candidate strongly aligns with the role>],
  "gaps": [<concrete skills, experiences, or qualifications the candidate is missing>]
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

        await db
            .update(usersTable)
            .set({
                tokensRemaining:
                    user.tokensRemaining && user.tokensRemaining - used,
                jobDescriptionMatchings: sql`${usersTable.jobDescriptionMatchings} - 1`,
            })
            .where(eq(usersTable.id, user.id));

        return NextResponse.json({
            success: true,
            data: JSON.parse(output),
            tokensUsed: used,
        });
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            {
                success: false,
                message: "Internal Server Error!",
            },
            { status: 500 },
        );
    }
}
