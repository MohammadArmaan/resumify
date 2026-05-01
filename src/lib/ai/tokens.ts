// lib/ai/tokens.ts

export function estimateTokens(text: string) {
    const words = text.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words * 1.3));
}