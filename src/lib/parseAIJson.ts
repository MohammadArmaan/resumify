export function parseAIJson(raw: string) {
    try {
        // Remove markdown code blocks
        let cleaned = raw
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        // Extract JSON if extra text exists
        const firstBrace = cleaned.indexOf("{");
        const lastBrace = cleaned.lastIndexOf("}");

        if (firstBrace !== -1 && lastBrace !== -1) {
            cleaned = cleaned.slice(firstBrace, lastBrace + 1);
        }

        return JSON.parse(cleaned);
    } catch (err) {
        console.error("AI JSON PARSE ERROR:", raw);
        throw new Error("Invalid AI JSON response");
    }
}