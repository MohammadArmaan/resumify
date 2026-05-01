// lib/ai/gemini.ts
// KEEP SAME FILE NAME so no route imports break.
// Internally switched to Groq.

import OpenAI from "openai";

const groq = new OpenAI({
    apiKey: process.env.GROQ_API_KEY!,
    baseURL: "https://api.groq.com/openai/v1",
});

/**
 * Fast + cheap model
 * Great for:
 * - enhance description
 * - ATS score
 * - parsing
 * - job match
 */
export const flashModel = {
    generateContent: async (prompt: string) => {
        const response =
            await groq.chat.completions.create({
                model: "llama-3.1-8b-instant",
                messages: [
                    {
                        role: "user",
                        content: prompt,
                    },
                ],
                temperature: 0.4,
            });

        return {
            response: {
                text: () =>
                    response.choices[0]?.message
                        ?.content || "",
            },
        };
    },
};

/**
 * Higher quality model
 * Great for:
 * - cover letters
 * - premium summaries
 * - structured outputs
 */
export const proModel = {
    generateContent: async (prompt: string) => {
        const response =
            await groq.chat.completions.create({
                model: "llama-3.3-70b-versatile",
                messages: [
                    {
                        role: "user",
                        content: prompt,
                    },
                ],
                temperature: 0.6,
            });

        return {
            response: {
                text: () =>
                    response.choices[0]?.message
                        ?.content || "",
            },
        };
    },
};