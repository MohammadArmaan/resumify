// app/api/imagekit/remove-bg/route.ts

import { NextRequest, NextResponse } from "next/server";
import { imagekit } from "@/lib/imagekit";

export async function POST(req: NextRequest) {
    const form = await req.formData();

    const file =
        form.get("file") as File;

    const buffer = Buffer.from(
        await file.arrayBuffer()
    );

    const uploaded =
        await imagekit.upload({
            file: buffer,
            fileName: file.name,
            useUniqueFileName: true,
        });

    const finalUrl =
        uploaded.url +
        "?tr=e-bgremove";

    return NextResponse.json({
        success: true,
        url: finalUrl,
    });
}