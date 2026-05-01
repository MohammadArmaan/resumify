import { db } from "@/config/db";
import { usersTable } from "@/config/userSchema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
    try {
        const { token, password } = await req.json();

        if (!token || !password) {
            return NextResponse.json(
                { success: false, message: "All fields are required!" },
                { status: 40 },
            );
        }

        if (password.length < 8) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Password must be at least 8 characters",
                },
                { status: 400 },
            );
        }

        // ✅ Hash incoming token (IMPORTANT FIX)
        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        const userList = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.resetPasswordToken, hashedToken));

        if (userList.length === 0) {
            return NextResponse.json(
                { success: false, message: "Invalid or expired token!" },
                { status: 400 },
            );
        }

        const user = userList[0];

        if (
            !user.resetPasswordExpires ||
            user.resetPasswordExpires < new Date()
        ) {
            return NextResponse.json(
                { success: false, message: "The Reset Token has expired!" },
                { status: 400 },
            );
        }

        const hashedPassword = (await bcrypt.hash(password, 10)).toString();

        await db
            .update(usersTable)
            .set({
                passwordHash: hashedPassword,
                resetPasswordToken: null,
                resetPasswordExpires: null,
            })
            .where(eq(usersTable.id, user.id));

        return NextResponse.json(
            { success: true, message: "Password has been reset successfully!" },
            { status: 200 },
        );
    } catch (error) {
        console.error("Internal Server Error!", error);

        return NextResponse.json(
            { success: false, message: "Internal Server Error!" },
            { status: 500 },
        );
    }
}
