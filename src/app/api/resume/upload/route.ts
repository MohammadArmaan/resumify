// app/api/resume/upload/route.ts

import { NextRequest, NextResponse } from "next/server";
import { and, eq, sql } from "drizzle-orm";
import { extractText, getDocumentProxy } from "unpdf";
import { db } from "@/config/db";
import { usersTable } from "@/config/userSchema";
import { resumesTable } from "@/config/resumeSchema";
import { getUserFromRequest } from "@/lib/jwt";
import { proModel } from "@/lib/ai/gemini";

export async function POST(req: NextRequest) {
    try {
        const auth = await getUserFromRequest(req);

        if (!auth) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                { status: 401 },
            );
        }

        const userId = auth[0].id;

        const [user] = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.id, userId))
            .limit(1);

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User not found",
                },
                { status: 404 },
            );
        }

        if (!user.isSubscribed) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Upgrade plan to upload resumes",
                },
                { status: 403 },
            );
        }

        if (user.tokensRemaining && user.tokensRemaining <= 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "No AI tokens remaining",
                },
                { status: 403 },
            );
        }

        const formData = await req.formData();

        const title =
            formData.get("title")?.toString().trim() || "Imported Resume";

        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Resume file required",
                },
                { status: 400 },
            );
        }

        const bytes = await file.arrayBuffer();
        const pdf = await getDocumentProxy(new Uint8Array(bytes));
        const { text } = await extractText(pdf, { mergePages: true });

        const resumeText = text.replace(/\s+/g, " ").trim().slice(0, 12000);

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
      "isCurrent": false
    }
  ],
  "education": [
    {
      "institution": "",
      "degree": "",
      "field": "",
      "graduationDate": "",
      "gpa": ""
    }
  ],
  "project": [
    {
      "name": "",
      "type": "",
      "description": ""
    }
  ],
  "template": "classic",
  "accentColor": "#10B981"
}

Resume Text:
${resumeText}
`;

        const ai = await proModel.generateContent(prompt);

        const raw = ai.response
            .text()
            .trim()
            .replace(/```json/g, "")
            .replace(/```/g, "");

        const parsedJson = JSON.parse(raw);

        const uuid = crypto.randomUUID();

        const updated = await db
            .update(usersTable)
            .set({
                credits: sql`${usersTable.credits} - 1`,
            })
            .where(
                and(eq(usersTable.id, userId), sql`${usersTable.credits} > 0`),
            )
            .returning();

        // 2. If no row updated → no credits
        if (!updated.length) {
            throw new Error("No credits left");
        }

        // 3. THEN create resume
        const [resume] = await db
            .insert(resumesTable)
            .values({
                uuid,
                userId,
                title,
                personalInfo: parsedJson.personalInfo,
                professionalSummary: parsedJson.professionalSummary,
                skills: parsedJson.skills,
                experience: parsedJson.experience,
                education: parsedJson.education,
                project: parsedJson.project,
                template: parsedJson.template || "modern",
                accentColor: parsedJson.accentColor || "#10B981",
            })
            .returning();

        return NextResponse.json({
            success: true,
            message: "Resume uploaded successfully",
            resume,
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to upload resume",
            },
            { status: 500 },
        );
    }
}
