import { db } from "@/config/db";
import { usersTable } from "@/config/userSchema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import { signToken } from "@/lib/jwt";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function POST(req: NextRequest) {
    try {
        const { token } = await req.json();

        if (!token) {
            return NextResponse.json(
                { success: false, message: "Token missing" },
                { status: 400 }
            );
        }

        // Verify Google token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        if (!payload) {
            return NextResponse.json(
                { success: false, message: "Invalid token" },
                { status: 401 }
            );
        }

        const email = payload.email!;
        const fullName = payload.name!;
        const profilePhoto = payload.picture!;
        const googleId = payload.sub!;

        // Check if user exists
        const existingUser = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.email, email));

let user;

if (existingUser.length === 0) {
    // Create new user (Google signup)
    const newUser = await db
        .insert(usersTable)
        .values({
            email,
            fullName,
            profilePhoto: user.profilePhoto ?? profilePhoto,
            googleId,
            emailVerified: true,
        })
        .returning();

    user = newUser[0];
} else {
    user = existingUser[0];

    // Link Google account if not already linked
    if (!user.googleId) {
        await db
            .update(usersTable)
            .set({
                googleId,
                profilePhoto: user.profilePhoto ?? profilePhoto,
                fullName: user.fullName ?? fullName,
            })
            .where(eq(usersTable.email, email));
    }

    // If already linked → optionally refresh profile
    else {
        await db
            .update(usersTable)
            .set({
                profilePhoto,
                fullName,
            })
            .where(eq(usersTable.email, email));
    }
}
        // Generate JWT
        const jwtToken = signToken({
            id: user.id,
            email: user.email,
        });

        const response = NextResponse.json(
            {
                success: true,
                message: "Google login successful",
            },
            { status: 200 }
        );

        // Set cookie
        response.cookies.set("token", jwtToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60,
            path: "/",
        });

        return response;
    } catch (error) {
        console.error("Google Auth Error:", error);

        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
}