// subscription-types.ts

export type BillingCycle = "MONTHLY" | "YEARLY";
export type PricingTier = "RECOMMENDED" | "ENTERPRISE";

// ── Create ────────────────────────────────────────────────────────────────────

export interface CreateSubscriptionInput {
    plan: BillingCycle;
    pricing: PricingTier;
}

export interface RazorpayOrder {
    id: string;
    amount: number;       // in paise
    currency: string;
    receipt: string;
}

export interface CreateSubscriptionResponse {
    success: boolean;
    order: RazorpayOrder;
}

// ── Verify ────────────────────────────────────────────────────────────────────

export interface VerifySubscriptionInput {
    plan: BillingCycle;
    pricing: PricingTier;
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}

export interface VerifySubscriptionResponse {
    message: string;
    plan: BillingCycle;
    pricing: PricingTier;
    startDate: string;
    endDate: string;
    uuid: string;
}

// ── Status ────────────────────────────────────────────────────────────────────

export interface SubscriptionStatusResponse {
    isSubscribed: boolean;
    plan: BillingCycle | null;        // "MONTHLY" | "YEARLY"
    pricing: PricingTier | null;      // "RECOMMENDED" | "ENTERPRISE"
    expiry: string | null;
    credits?: number;
    atsScoreChecks?: number;
    jobDescriptionMatchings?: number;
    coverLetterGenerations?: number;
    tokensRemainig?: number;
    // Derived fields used by the old page (kept for compat if needed)
    monthlyPrice?: number;
    yearlyPrice?: number;
}