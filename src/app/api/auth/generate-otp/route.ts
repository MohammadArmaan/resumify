import { db } from "@/config/db";
import { usersTable } from "@/config/userSchema";
import { otpEmailTemplate } from "@/email-templates/otpTemplate";
import { sendEmail } from "@/lib/sendEmail";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json(
                { success: false, message: "No email provided!" },
                { status: 400 },
            );
        }

        const checkUser = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.email, email));

        if (checkUser.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "No user exists",
                },
                { status: 400 },
            );
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        await db.update(usersTable).set({
            emailVerificationOtp: otp,
            emailVerificationExpires: otpExpiry,
        }).where(eq(usersTable.email, email))

        await sendEmail({
            to: email,
            subject: "Your Resumify Verification Code",
            html: otpEmailTemplate(otp)
        })

        return NextResponse.json(
            { success: true, message: "OTP sent to email!" },
            { status: 200 },
        );
    } catch (error) {
        console.log("Internal Server Error!", error);

        return NextResponse.json(
            { success: false, message: "Internal Server Error!" },
            { status: 500 },
        );
    }
}
