import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/config/db";
import { eq, desc } from "drizzle-orm";
import { sendEmail } from "@/lib/sendEmail";
import { getUserFromRequest } from "@/lib/jwt";
import { subscriptionTable } from "@/config/subscriptionSchema";
import { usersTable } from "@/config/userSchema";
import { generateSubscriptionInvoicePdf } from "@/lib/generateSubscriptionInvoicePdf";
import { subscriptionSuccessTemplate } from "@/email-templates/subscriptionSuccessTemplate";
import { calculateUpgradeAmount, PLAN_LIMITS, PRICING } from "@/lib/subscriptionPricing";

export async function POST(req: NextRequest) {
    try {
        /* -------- AUTH -------- */
        const user = await getUserFromRequest(req);
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const userId = user[0].id;

        /* -------- BODY -------- */
        const { plan, pricing, razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

        if (!plan || !pricing || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
        }

        /* -------- VERIFY SIGNATURE FIRST — before any DB writes -------- */
        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        if (generatedSignature !== razorpay_signature) {
            return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
        }

        /* -------- IDEMPOTENCY -------- */
        const existingPayment = await db
            .select()
            .from(subscriptionTable)
            .where(eq(subscriptionTable.razorpayPaymentId, razorpay_payment_id));

        if (existingPayment.length > 0) {
            return NextResponse.json({ message: "Already verified" });
        }

        /* -------- EXPIRE OLD ACTIVE SUB IF UPGRADING -------- */
        const [existingSub] = await db
            .select()
            .from(subscriptionTable)
            .where(eq(subscriptionTable.userId, userId))
            .orderBy(desc(subscriptionTable.endDate))
            .limit(1);

        let amount = PRICING[plan][pricing];

        if (
            existingSub &&
            existingSub.status === "ACTIVE" &&
            new Date(existingSub.endDate) > new Date()
        ) {
            amount = calculateUpgradeAmount(existingSub, plan, pricing);

            await db
                .update(subscriptionTable)
                .set({ status: "EXPIRED" })
                .where(eq(subscriptionTable.id, existingSub.id));
        }

        /* -------- DATES -------- */
        const startDate = new Date();
        const endDate = new Date(startDate);
        if (plan === "MONTHLY") {
            endDate.setDate(endDate.getDate() + 30);
        } else {
            endDate.setDate(endDate.getDate() + 365);
        }

        /* -------- INSERT ACTIVE SUBSCRIPTION -------- */
        const [insertedSubscription] = await db
            .insert(subscriptionTable)
            .values({
                userId,
                plan,
                pricing,
                status: "ACTIVE",   // ✅ only set ACTIVE after verified signature
                startDate,
                endDate,
                amount,
                razorpayOrderId: razorpay_order_id,
                razorpayPaymentId: razorpay_payment_id,   // ✅ always populated
                razorpaySignatureId: razorpay_signature,  // ✅ always populated
            })
            .returning();

        /* -------- UPDATE USER LIMITS -------- */
        const limits = PLAN_LIMITS[pricing];
        await db.update(usersTable)
            .set({
                isSubscribed: true,
                pricing: pricing,
                credits: limits.credits,
                atsScoreChecks: limits.ats,
                jobDescriptionMatchings: limits.jd,
                coverLetterGenerations: limits.coverLetter,
                tokensRemaining: limits.tokens,
            })
            .where(eq(usersTable.id, userId)); // ✅ was missing WHERE clause before!

        /* -------- INVOICE + EMAIL -------- */
        const invoicePdf = await generateSubscriptionInvoicePdf({
            invoiceNumber: insertedSubscription.uuid,
            issuedAt: new Date(),
            plan,
            pricing,
            startDate,
            endDate,
            amount,
            vendor: { name: user[0].fullName, email: user[0].email },
        });

        await sendEmail({
            to: user[0].email,
            subject: "Subscription Activated 🎉",
            html: subscriptionSuccessTemplate({
                fullName: user[0].fullName,
                plan,
                pricing,
                expiry: endDate,
                uuid: insertedSubscription.uuid,
            }),
            attachments: [{
                filename: `Subscription-${insertedSubscription.uuid}.pdf`,
                content: invoicePdf,
                contentType: "application/pdf",
            }],
        });

        return NextResponse.json({
            message: "Subscription activated",
            plan,
            pricing,
            startDate,
            endDate,
            uuid: insertedSubscription.uuid,
        });
    } catch (err) {
        console.error("Subscription verify error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}