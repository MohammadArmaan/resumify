import { db } from "@/config/db";
import { usersTable } from "@/config/userSchema";
import { signToken } from "@/lib/jwt";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json(); 
        if (!email || !password) {
            return NextResponse.json(
                { success: false, message: "Please provide all fields" },
                { status: 400 }
            );
        }

        const user = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.email, email));

        if (user.length === 0) {
            return NextResponse.json(
                { success: false, message: "Invalid Credentials" },
                { status: 401 }
            );
        }

        const existingUser = user[0];

        //  Handle Google users
        if (!existingUser.passwordHash) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Please login using Google",
                },
                { status: 400 }
            );
        }

        // FIXED bcrypt compare
        const isMatch = await bcrypt.compare(
            password, // plain password
            existingUser.passwordHash // hashed password
        );

        if (!isMatch) {
            return NextResponse.json(
                { success: false, message: "Invalid Credentials" },
                { status: 401 }
            );
        }

        // Email verification check
        if (!existingUser.emailVerified) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Please verify your email first",
                },
                { status: 403 }
            );
        }

        // Generate token
        const token = signToken({
            id: existingUser.id,
            email: existingUser.email,
        });

        const response = NextResponse.json(
            { success: true, message: "Login successful!" },
            { status: 200 }
        );

        // Cookie
        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // better
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60,
            path: "/",
        });

        return response;
    } catch (error) {
        console.error("Internal Server Error!", error);

        return NextResponse.json(
            { success: false, message: "Internal Server Error!" },
            { status: 500 }
        );
    }
}