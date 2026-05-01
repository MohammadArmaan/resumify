// lib/jwt.ts
import { db } from "@/config/db";
import { usersTable } from "@/config/userSchema";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET!;

type TokenPayload = {
    id: string;
    email: string;
};

export function signToken(payload: object) {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: "7d",
    });
}

export function verifyToken(token: string): TokenPayload | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
        return decoded;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function getUserFromRequest(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    if (!token) return null;

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET!,
        ) as TokenPayload;

        const user = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.id, Number(decoded.id)))
            .limit(1);

        return user ?? null;
    } catch {
        return null;
    }
}
