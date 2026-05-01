import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { db } from "@/config/db";
import { usersTable } from "@/config/userSchema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                { success: false, user: null },
                { status: 401 },
            );
        }

        const decoded = verifyToken(token);

        if (!decoded) {
            return NextResponse.json(
                { success: false, user: null },
                { status: 401 },
            );
        }

        const user = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.id, Number(decoded.id)));

        if (!user.length) {
            return NextResponse.json(
                { success: false, user: null },
                { status: 404 },
            );
        }

        return NextResponse.json(
            {
                success: true,
                user: user[0],
            },
            { status: 200 },
        );
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { success: false, user: null },
            { status: 500 },
        );
    }
}
