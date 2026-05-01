import { db } from "@/config/db";
import { usersTable } from "@/config/userSchema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { sendEmail } from "@/lib/sendEmail";
import { resetPasswordTemplate } from "@/email-templates/resetPasswordTemplate";

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json(
                { success: false, message: "Email was not provided!" },
                { status: 400 },
            );
        }

        const user = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.email, email));

        if (user.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User does not exist, please sign up",
                },
                { status: 404 },
            );
        }

        const existingUser = user[0];

        //  Generate token
        const resetToken = crypto.randomBytes(32).toString("hex");

        //  Hash token before storing
        const hashedToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        await db
            .update(usersTable)
            .set({
                resetPasswordToken: hashedToken,
                resetPasswordExpires: expiresAt,
            })
            .where(eq(usersTable.email, email));

        //  Full URL
        const resetUrl = `${process.env.DOMAIN}/reset-password?token=${resetToken}`;

        //  Send email
        await sendEmail({
            to: email,
            subject: "Reset Your Password | Resumify",
            html: resetPasswordTemplate(existingUser.fullName, resetUrl),
        });

        return NextResponse.json(
            {
                success: true,
                message: "Password reset link sent to email",
            },
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
