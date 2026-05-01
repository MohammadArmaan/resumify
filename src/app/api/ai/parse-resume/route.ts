// app/api/ai/parse-resume/route.ts

import { NextRequest, NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";

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

        const { resumeText } = await req.json();

        const user = await getVerifiedAiUser(auth[0].id, "general");

        const prompt = `
You are an expert resume parser. Your job is to extract structured data from unformatted resume text with high accuracy.

Instructions:
- Extract all available information and map it precisely to the schema below
- For experience and education, always include start/end dates if mentioned (use "Present" for current roles)
- For skills, return a flat array of individual skill strings, not categories
- For projects, extract name, description, tech stack, and URL if available
- If a field has no data in the resume, use an empty string "" for strings, empty array [] for arrays
- Do NOT invent or assume information not present in the resume
- professionalSummary should be a concise 2–3 sentence paragraph if not explicitly written
- template must always be "modern" and accentColor must always be "#10B981"
- Return ONLY a valid JSON object — no markdown, no code fences, no explanation

Schema:
{
  "personalInfo": {
    "fullName": "",
    "email": "",
    "phone": "",
    "location": "",
    "linkedin": "",
    "github": "",
    "website": "",
    "profession": ""
  },
  "professionalSummary": "",
  "skills": [],
  "experience": [
    {
      "company": "",
      "position": "",
      "startDate": "",
      "endDate": "",
      "description": "",
      "isCurrent": boolean<false | true>
    }
  ],
  "education": [
    {
      "institution": "",
      "degree": "",
      "field": "",
      "graduationDate":    
      "gpa": ""
    }
  ],
  "project": [
    {
      "name": "",
      "type": ",
      "description": "",
    }
  ],
  "template": "modern",
  "accentColor": "#10B981"
}

Resume Text:
${resumeText}
`;

        const result = await proModel.generateContent(prompt);
        const output = result.response.text();

        const used = estimateTokens(resumeText) + estimateTokens(output);

        await db
            .update(usersTable)
            .set({
                tokensRemaining:
                    user.tokensRemaining && user.tokensRemaining - used,
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
