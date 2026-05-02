// app/api/ai/enhance-description/route.ts

import { NextRequest, NextResponse } from "next/server";
import { and, eq, sql } from "drizzle-orm";

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

        const { text } = await req.json();

        if (!text?.trim()) {
            return NextResponse.json(
                { success: false, message: "Text required" },
                { status: 400 },
            );
        }

        const user = await getVerifiedAiUser(auth[0].id);

        const prompt = `
You are an elite resume writer, recruiter, and hiring manager with 15+ years of experience reviewing resumes for internships, startups, and top tech companies.

Your task is to analyze the user's input and FIRST detect whether it is one of these:

1. Professional Summary
2. Work Experience Description
3. Project Description

Then rewrite it accordingly using the correct style.

========================
DETECTION RULES
========================

If input talks about:
- overall profile
- skills
- years of experience
- career goals
=> Treat as PROFESSIONAL SUMMARY

If input talks about:
- company
- responsibilities
- role
- job achievements
- teams
=> Treat as WORK EXPERIENCE

If input talks about:
- built / developed project
- app / platform / website
- technologies used
- features implemented
=> Treat as PROJECT DESCRIPTION

========================
REWRITE RULES
========================

FOR PROFESSIONAL SUMMARY:
- 2 to 3 lines maximum. Only if user specifies add more content
- Strong personal brand tone
- Mention core technologies / strengths
- Career-oriented and recruiter-friendly
- No first person language
- Paragraph format only. Only if user specifies you can make bullet points aswell

FOR WORK EXPERIENCE:
- 2 to 3 lines maximum. Only if user specifies add more content
- Start with strong action verbs
- Show ownership + impact
- Include measurable outcomes if given
- Paragraph format only. Only if user specifies you can make bullet points aswell

FOR PROJECT DESCRIPTION:
- Mention what was built
- Mention technologies if present
- Mention features / impact
- Strong engineering tone
- 2 to 3 lines maximum. Only if user specifies add more content
- Paragraph format only. Only if user specifies you can make bullet points aswell

========================
GLOBAL RULES
========================

- Use active voice only
- Remove weak phrases like:
  "worked on", "helped with", "responsible for"
- Improve grammar and clarity
- Do NOT fabricate metrics
- Do NOT add fake experience
- Return ONLY final rewritten text
- No labels
- No explanation
- No bullet points only if user inputs for bullet points or points
- You are directly chatting with user so please dont add template languages or suggestions like like **Rewritten Text**, PROJECT DESCRIPTION, etc

========================
USER INPUT
========================

${text}
`;

        const result = await flashModel.generateContent(prompt);
        const output = result.response.text().trim();
        const enhancedText = output
            .replace(
                "Based on the detection rules, I would classify the user's input as a PROFESSIONAL SUMMARY.",
                "",
            )
            .replace(
                "Based on the detection rules, I would classify the user's input as a PROJECT DESCRIPTION.",
                "",
            )
            .replace(
                "Based on the detection rules, I would classify the user's input as a WORK EXPERIENCE.",
                "",
            )
            .replace("I would categorize this as a PROJECT DESCRIPTION.", "")
            .replace("I would categorize this as a PROFESSIONAL SUMMARY.", "")
            .replace("I would categorize this as a WORK EXPERIENCE.", "")
            .replace("PROJECT SUMMARY:", "")
            .replace(" PROJECT DESCRIPTION:", "")
            .replace("WORK EXPERIENCE:", "")
            .replace("Project Description", "")
            .replace("Work Experience", "")
            .replace("Professional Summary", "")
            .replace("**rewritten text**", "")
            .replace("Here's the rewritten text:", "")
            .replace("Rewritten Text:", "")
            .replace("rewritten text:", "");

        const used = estimateTokens(text) + estimateTokens(output);

        const updated = await db
            .update(usersTable)
            .set({
                tokensRemaining: sql`${usersTable.tokensRemaining} - ${used}`,
            })
            .where(
                and(
                    eq(usersTable.id, user.id),
                    sql`${usersTable.tokensRemaining} >= ${used}`,
                ),
            )
            .returning();

        if (!updated.length) {
            throw new Error("Insufficient tokens");
        }

        return NextResponse.json({
            success: true,
            enhancedText,
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
