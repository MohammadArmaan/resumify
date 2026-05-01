import { db } from "@/config/db";
import { usersTable } from "@/config/userSchema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
    try {
        const { fullName, email, password } = await req.json();

        if (!fullName || !email || !password) {
            return NextResponse.json(
                { success: false, message: "Please provide all the fields!" },
                { status: 400 },
            );
        }

        const existingUser = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.email, email));

        if (existingUser.length > 0) {
            return NextResponse.json(
                { success: false, message: "User already exists" },
                { status: 409 },
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await db
            .insert(usersTable)
            .values({
                fullName,
                email,
                passwordHash: hashedPassword,
            })
            .returning();

        return NextResponse.json(
            {
                success: true,
                message: "User registered successfully!",
                user: newUser[0],
            },
            { status: 201 },
        );
    } catch (error) {
        console.error("Internal Server Error!", error);

        return NextResponse.json(
            {
                success: false,
                message: "Internal Server Error",
            },
            {
                status: 500,
            },
        );
    }
}
