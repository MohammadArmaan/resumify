// app/api/ai/cover-letter/route.ts

import { NextRequest, NextResponse } from "next/server";
import { and, eq, sql } from "drizzle-orm";

import { proModel } from "@/lib/ai/gemini";
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

        const { company, role, resumeSummary } = await req.json();

        const user = await getVerifiedAiUser(auth[0].id, "coverLetter");

        const prompt = `
You are a professional career coach and copywriter who specializes in writing compelling, personalized cover letters that get candidates interviews.

Write a tailored cover letter for the candidate applying to this specific role.

Guidelines:
- Opening paragraph: Hook the reader with genuine enthusiasm and a standout achievement relevant to the role — avoid generic openers like "I am writing to apply..."
- Middle paragraph(s): Connect the candidate's experience and skills directly to the company's needs and the role's responsibilities. Be specific, not generic
- Closing paragraph: Confident call to action, express eagerness for a conversation
- Tone: Professional yet human — avoid stiff corporate language
- Length: 3–4 paragraphs, no longer than one page
- Do NOT use placeholder brackets like [Your Name] — write fluidly from the candidate's perspective
- The respone should be very human, it should not look AI generated
- Return ONLY the cover letter text, no subject line, no explanations

Company: ${company}
Role: ${role}
Candidate Background: ${resumeSummary}
`;

        const result = await proModel.generateContent(prompt);
        const output = result.response.text();

        const used =
            estimateTokens(company) +
            estimateTokens(role) +
            estimateTokens(resumeSummary) +
            estimateTokens(output);

        const updated = await db
            .update(usersTable)
            .set({
                tokensRemaining: sql`${usersTable.tokensRemaining} - ${used}`,
                coverLetterGenerations: sql`${usersTable.coverLetterGenerations} - 1`,
            })
            .where(
                and(
                    eq(usersTable.id, user.id),
                    sql`${usersTable.tokensRemaining} >= ${used}`,
                    sql`${usersTable.coverLetterGenerations} > 0`,
                ),
            )
            .returning();

        if (!updated.length) {
            throw new Error(
                "Insufficient tokens or cover letter limit reached",
            );
        }

        return NextResponse.json({
            success: true,
            coverLetter: output,
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
