import { db } from "@/config/db";
import Razorpay from "razorpay";
import { subscriptionTable } from "@/config/subscriptionSchema";
import { getUserFromRequest } from "@/lib/jwt";
import { calculateUpgradeAmount, PRICING } from "@/lib/subscriptionPricing";
import { desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
    try {
        const user = await getUserFromRequest(req);
        if (!user) {
            return NextResponse.json({ success: false, message: "Unauthorized user!" }, { status: 401 });
        }

        const { plan, pricing } = await req.json();

        if (!plan || !["MONTHLY", "YEARLY"].includes(plan)) {
            return NextResponse.json({ success: false, message: "Invalid Plan" }, { status: 400 });
        }
        if (!pricing || !["RECOMMENDED", "ENTERPRISE"].includes(pricing)) {
            return NextResponse.json({ success: false, message: "Invalid Pricing" }, { status: 400 });
        }

        const userId = user[0].id;

        // Get latest active subscription for upgrade calculation
        const [existingSubscription] = await db
            .select()
            .from(subscriptionTable)
            .where(eq(subscriptionTable.userId, userId))
            .orderBy(desc(subscriptionTable.endDate))
            .limit(1);

        let amount = 0;

        if (
            existingSubscription &&
            existingSubscription.status === "ACTIVE" &&
            new Date(existingSubscription.endDate) > new Date()
        ) {
            amount = calculateUpgradeAmount(existingSubscription, plan, pricing);
        } else {
            amount = PRICING[plan][pricing] * 100; // paise
        }

        if (amount <= 0) {
            return NextResponse.json({ success: false, message: "Invalid upgrade request" }, { status: 400 });
        }

        // ✅ ONLY create the Razorpay order — do NOT touch the DB here
        const order = await razorpay.orders.create({
            amount,
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        });

        return NextResponse.json({ success: true, order });
    } catch (error) {
        console.error("Create subscription error:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error!" }, { status: 500 });
    }
}