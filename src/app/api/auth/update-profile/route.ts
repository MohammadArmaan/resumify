import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/db";
import { usersTable } from "@/config/userSchema";
import { eq } from "drizzle-orm";
import { getUserFromRequest, verifyToken } from "@/lib/jwt";
import bcrypt from "bcryptjs";

export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json();

        const { fullName, profilePhoto, currentPassword, newPassword } = body;

        const users = await getUserFromRequest(req);

        if (!users || users.length === 0) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 },
            );
        }

        const user = users[0];

        // 🔐 Handle password change
        let updatedPasswordHash = user.passwordHash;

        if (currentPassword && newPassword) {
            if (!user.passwordHash) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Password login not enabled for this account",
                    },
                    { status: 400 },
                );
            }

            const isMatch = await bcrypt.compare(
                currentPassword,
                user.passwordHash,
            );

            if (!isMatch) {
                return NextResponse.json(
                    { success: false, message: "Current password incorrect" },
                    { status: 400 },
                );
            }

            if (newPassword.length < 8) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Password must be at least 8 characters",
                    },
                    { status: 400 },
                );
            }

            updatedPasswordHash = await bcrypt.hash(newPassword, 10);
        }

        // 🧠 Update user
        const updatedUser = await db
            .update(usersTable)
            .set({
                fullName: fullName ?? user.fullName,
                profilePhoto: profilePhoto ?? user.profilePhoto,
                passwordHash: updatedPasswordHash,
            })
            .where(eq(usersTable.id, user.id))
            .returning();

        return NextResponse.json(
            {
                success: true,
                message: "Profile updated successfully",
                user: updatedUser[0],
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("Update Profile Error:", error);

        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 },
        );
    }
}
