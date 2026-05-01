import { db } from "@/config/db";
import { usersTable } from "@/config/userSchema";
import { welcomeEmailTemplate } from "@/email-templates/welcomeEmailTemplate";
import { sendEmail } from "@/lib/sendEmail";
import { and, eq, gt } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { email, otp } = await req.json();

        // Validation
        if (!email) {
            return NextResponse.json(
                { success: false, message: "Email not provided!" },
                { status: 400 }
            );
        }

        if (!otp) {
            return NextResponse.json(
                { success: false, message: "OTP not provided!" },
                { status: 400 }
            );
        }

        // Validate OTP + Expiry
        const validateOtp = await db
            .select()
            .from(usersTable)
            .where(
                and(
                    eq(usersTable.email, email),
                    eq(usersTable.emailVerificationOtp, otp),
                    gt(usersTable.emailVerificationExpires, new Date())
                )
            );

        if (validateOtp.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid or expired OTP",
                },
                { status: 400 }
            );
        }

        // Get user name
        const user = await db
            .select({
                fullName: usersTable.fullName,
            })
            .from(usersTable)
            .where(eq(usersTable.email, email));

        // Update user
        await db
            .update(usersTable)
            .set({
                emailVerified: true,
                emailVerificationOtp: null,
                emailVerificationExpires: null,
            })
            .where(eq(usersTable.email, email));

        // Send welcome email
        await sendEmail({
            to: email,
            subject: "Welcome to Resumify | AI Resume Builder",
            html: welcomeEmailTemplate(user[0].fullName), 
        });

        return NextResponse.json(
            {
                success: true,
                message: "Email verified successfully",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Internal Server Error", error);

        return NextResponse.json(
            { success: false, message: "Internal Server Error!" },
            { status: 500 }
        );
    }
}