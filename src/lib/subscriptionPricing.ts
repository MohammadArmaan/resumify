type PlanType = "MONTHLY" | "YEARLY";
type PricingType = "RECOMMENDED" | "ENTERPRISE";

type Subscription = {
    plan: PlanType;
    pricing: PricingType;
};

export const PRICING: Record<PlanType, Record<PricingType, number>> = {
    MONTHLY: {
        RECOMMENDED: 10,
        ENTERPRISE: 50,
    },
    YEARLY: {
        RECOMMENDED: 100,
        ENTERPRISE: 500,
    },
};

export const PLAN_LIMITS = {
    RECOMMENDED: {
        credits: 10,
        ats: 5,
        jd: 5,
        coverLetter: 5,
        tokens: 5000
    },
    ENTERPRISE: {
        credits: 100,
        ats: 50,
        jd: 20,
        coverLetter: 20,
        tokens: 20000
    },
} as const;

export function calculateUpgradeAmount(
    currentSub: Subscription,
    plan: PlanType,
    pricing: PricingType
): number {
    const currentPrice = PRICING[currentSub.plan][currentSub.pricing];
    const newPrice = PRICING[plan][pricing];

    return newPrice > currentPrice
        ? (newPrice - currentPrice)
        : 0;
}