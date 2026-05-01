import { NextResponse } from "next/server";

export async function POST() {
    const response = NextResponse.json(
        {
            success: true,
            message: "Logged out successfully",
        },
        { status: 200 },
    );

    // Remove token cookie
    response.cookies.set("token", "", {
        httpOnly: true,
        expires: new Date(0), // Expire immediately
        path: "/",
    });

    return response;
}
