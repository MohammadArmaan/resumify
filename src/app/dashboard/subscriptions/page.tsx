"use client";
import { BadgeDollarSignIcon } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Title from "@/components/home/Title";
import { useUser } from "@/hooks/queries/useUser";
import { useCreateSubscription } from "@/hooks/mutations/subscription/useCreateSubscription";
import { useVerifySubscription } from "@/hooks/mutations/subscription/useVerifySubscription";
import { useSubscriptionStatus } from "@/hooks/queries/useSubscriptionStatus";
import { PRICING, PLAN_LIMITS } from "@/lib/subscriptionPricing";
import { useRazorpay } from "@/hooks/useRazorpay";
import { toast } from "sonner";

// ─── Discount Badge Config (change value here) ────────────────────────────────

const YEARLY_DISCOUNT_BADGE = "90% OFF";

// ─── Types ────────────────────────────────────────────────────────────────────

type PlanName = "Free" | "Recommended" | "Enterprise";
type BillingCycle = "MONTHLY" | "YEARLY";
type PricingTier = "RECOMMENDED" | "ENTERPRISE";

interface PlanMeta {
    name: PlanName;
    pricingKey: PricingTier | null;
    mostPopular?: boolean;
    features: { text: string; available: boolean }[];
}

// ─── Static feature lists ─────────────────────────────────────────────────────

const PLAN_META: PlanMeta[] = [
    {
        name: "Free",
        pricingKey: null,
        features: [
            { text: "2 Resume Credits", available: true },
            { text: "Basic Resume Builder", available: true },
            { text: "AI Assistance", available: false },
            { text: "Resume Upload & Parsing", available: false },
            { text: "Token Usage", available: false },
            { text: "ATS Score Analysis", available: false },
            { text: "Job Description Matching", available: false },
            { text: "AI Cover Letter Generator", available: false },
            { text: "2 Resume Templates", available: true },
        ],
    },
    {
        name: "Recommended",
        pricingKey: "RECOMMENDED",
        mostPopular: true,
        features: [
            { text: `${PLAN_LIMITS.RECOMMENDED.credits} Resume Credits`, available: true },
            { text: "AI Resume Assistance", available: true },
            { text: "Resume Upload & Parsing", available: true },
            { text: `Token Usage (${PLAN_LIMITS.RECOMMENDED.tokens.toLocaleString()}/month)`, available: true },
            { text: `ATS Score Analysis (${PLAN_LIMITS.RECOMMENDED.ats} uses/month)`, available: true },
            { text: `Job Description Matching (${PLAN_LIMITS.RECOMMENDED.jd} uses/month)`, available: true },
            { text: `AI Cover Letter (${PLAN_LIMITS.RECOMMENDED.coverLetter} uses/month)`, available: true },
            { text: "Up to 5 Resume Templates", available: true },
            { text: "Basic Support", available: true },
        ],
    },
    {
        name: "Enterprise",
        pricingKey: "ENTERPRISE",
        features: [
            { text: `${PLAN_LIMITS.ENTERPRISE.credits} Resume Credits`, available: true },
            { text: "Unlimited AI Assistance", available: true },
            { text: "Advanced Resume Parsing", available: true },
            { text: `Token Usage (${PLAN_LIMITS.ENTERPRISE.tokens.toLocaleString()}/month)`, available: true },
            { text: `ATS Score Analysis (${PLAN_LIMITS.ENTERPRISE.ats} uses/month)`, available: true },
            { text: `Job Description Matching (${PLAN_LIMITS.ENTERPRISE.jd} uses/month)`, available: true },
            { text: `AI Cover Letter (${PLAN_LIMITS.ENTERPRISE.coverLetter} uses/month)`, available: true },
            { text: "Premium Resume Templates", available: true },
            { text: "Priority Support", available: true },
        ],
    },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const PLAN_ORDER: Record<PlanName, number> = {
    Free: 0,
    Recommended: 1,
    Enterprise: 2,
};

function basePrice(pricingKey: PricingTier, billing: BillingCycle): number {
    return PRICING[billing][pricingKey];
}

function upgradePrice(
    currentPricingKey: PricingTier | null,
    currentBilling: BillingCycle | null,
    targetKey: PricingTier,
    targetBilling: BillingCycle,
): number {
    const target = PRICING[targetBilling][targetKey];
    if (!currentPricingKey || !currentBilling) return target;

    const current = PRICING[currentBilling][currentPricingKey];

    if (currentBilling === "YEARLY" && targetBilling === "MONTHLY" && targetKey === currentPricingKey) {
        return 0;
    }

    return Math.max(target - current, 0);
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SubscriptionPage() {
    const [isYearly, setIsYearly] = useState(false);
    const router = useRouter();
    const razorpayLoaded = useRazorpay();

    const { data: user } = useUser();
    const createSubscriptionMutation = useCreateSubscription();
    const verifySubscriptionMutation = useVerifySubscription();
    const { data: subscriptionStatus } = useSubscriptionStatus();

    const billing: BillingCycle = isYearly ? "YEARLY" : "MONTHLY";

    const currentPricingKey = (subscriptionStatus?.pricing ?? null) as PricingTier | null;
    const currentBilling = (subscriptionStatus?.plan ?? null) as BillingCycle | null;

    const currentPlanName: PlanName =
        currentPricingKey === "ENTERPRISE"
            ? "Enterprise"
            : currentPricingKey === "RECOMMENDED"
              ? "Recommended"
              : "Free";

    const handlePlanSelect = async (meta: PlanMeta) => {
        if (!user) {
            router.push("/login");
            return;
        }
        if (!meta.pricingKey) {
            router.push("/dashboard");
            return;
        }
        if (!razorpayLoaded) {
            console.error("Razorpay not loaded yet");
            return;
        }

        const amountInRupees = upgradePrice(
            currentPricingKey,
            currentBilling,
            meta.pricingKey,
            billing,
        );
        if (amountInRupees <= 0) return;

        const result = await createSubscriptionMutation.mutateAsync({
            plan: billing,
            pricing: meta.pricingKey,
        });

        const order = result.order;

        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
            amount: order.amount * 100,
            currency: order.currency,
            name: "Resumify",
            description: `${meta.name} Plan – ${billing.charAt(0) + billing.slice(1).toLowerCase()}`,
            order_id: order.id,

            handler: async function (response: {
                razorpay_order_id: string;
                razorpay_payment_id: string;
                razorpay_signature: string;
            }) {
                await verifySubscriptionMutation.mutateAsync({
                    plan: billing,
                    pricing: meta.pricingKey!,
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                });
                toast.success("Payment Completed Successfully!");
                router.push("/dashboard");
            },

            theme: { color: "#22c55e" },
            method: {
                method: {
                    upi: true,
                    card: true,
                    netbanking: true,
                    wallet: true,
                },
            },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
    };

    return (
        <div id="pricing" className="flex flex-col items-center py-16 px-4">
            {/* Badge */}
            <div className="flex items-center gap-2 text-sm text-primary bg-green-400/10 border border-green-200 dark:border-green-400 rounded-full px-4 py-1">
                <BadgeDollarSignIcon className="stroke-primary h-4 w-4" />
                <span>Pricing</span>
            </div>

            {/* Title */}
            <Title
                title="Simple, transparent pricing"
                description="Choose a plan based on your resume needs — from basic creation to advanced AI-powered optimization."
            />

            {/* Monthly / Yearly toggle */}
            <div className="relative p-1 bg-background border border-gray-200 rounded-full inline-flex items-center mb-16 w-60">
                <div
                    className={`absolute -z-10 w-[calc(50%-4px)] h-13.25 rounded-full bg-linear-to-r from-green-700 to-green-400/70 transition-transform duration-300 ease-in-out pointer-events-none
                    ${isYearly ? "translate-x-full" : "translate-x-0"}`}
                />
                <button
                    onClick={() => setIsYearly(false)}
                    className={`relative bg-background z-10 flex-1 py-2.5 cursor-pointer rounded-full text-sm font-medium text-center flex items-center justify-center gap-1 transition-colors duration-300
                    ${!isYearly ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
                >
                    Monthly
                    {/* <span className="text-xs bg-green-500 text-white font-bold px-1.5 py-0.5 rounded-full leading-tight">
                        {YEARLY_DISCOUNT_BADGE}
                    </span> */}
                </button>
                <button
                    onClick={() => setIsYearly(true)}
                    className={`relative z-10 flex-1 py-2.5 cursor-pointer rounded-full text-sm font-medium text-center flex items-center justify-center gap-1 transition-colors duration-300
                    ${isYearly ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
                >
                    Yearly Save More
                    {/* <span className="text-xs bg-green-500 text-white font-bold px-1.5 py-0.5 rounded-full leading-tight">
                        {YEARLY_DISCOUNT_BADGE}
                    </span> */}
                </button>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full items-end">
                {PLAN_META.map((meta) => {
                    const displayPrice = meta.pricingKey
                        ? upgradePrice(currentPricingKey, currentBilling, meta.pricingKey, billing)
                        : 0;

                    const fullPrice = meta.pricingKey
                        ? basePrice(meta.pricingKey, billing)
                        : 0;
                    const isUpgrade = displayPrice < fullPrice && displayPrice > 0;

                    const isCurrentPlan =
                        meta.name === currentPlanName &&
                        currentBilling === billing;

                    const isDowngrade =
                        PLAN_ORDER[meta.name] < PLAN_ORDER[currentPlanName] ||
                        (meta.name === currentPlanName &&
                            currentBilling === "YEARLY" &&
                            billing === "MONTHLY") ||
                        (currentBilling === "YEARLY" &&
                            billing === "MONTHLY" &&
                            meta.pricingKey !== null &&
                            PRICING["MONTHLY"][meta.pricingKey] <=
                                PRICING["YEARLY"][currentPricingKey!]);

                    const isSameTierSameBilling = isCurrentPlan;

                    const buttonDisabled =
                        isDowngrade ||
                        isSameTierSameBilling ||
                        createSubscriptionMutation.isPending ||
                        verifySubscriptionMutation.isPending;

                    let buttonLabel: string;
                    if (isDowngrade) {
                        buttonLabel = "Not Available";
                    } else if (isSameTierSameBilling) {
                        buttonLabel = "Current Plan";
                    } else if (!meta.pricingKey) {
                        buttonLabel = "Start Free";
                    } else {
                        buttonLabel = isUpgrade
                            ? `Upgrade ₹${displayPrice}`
                            : `Get Started ₹${displayPrice}`;
                    }

                    return (
                        <div
                            key={meta.name}
                            className={
                                meta.mostPopular
                                    ? "bg-linear-to-r from-primary to-green-300 rounded-3xl p-2 shadow-xl hover:shadow-lg transition-shadow"
                                    : ""
                            }
                        >
                            {meta.mostPopular && (
                                <p className="text-center text-green-800 font-bold text-sm py-1.5">
                                    Most Popular
                                </p>
                            )}

                            <div
                                className={`rounded-3xl p-6 bg-background ${
                                    !meta.mostPopular
                                        ? "border border-neutral-200 hover:shadow-lg transition-shadow"
                                        : ""
                                }`}
                            >
                                <h3 className="text-foreground/70 text-sm mb-6">
                                    {meta.name}
                                </h3>

                                {/* Price display */}
                                <div className="flex items-baseline gap-1 mb-2">
                                    <span className="text-[28px] text-foreground">
                                        ₹{displayPrice}
                                    </span>
                                    <span className="text-foreground/70 text-xs">
                                        {isYearly ? "/ year" : "/ month"}
                                    </span>
                                    {/* Always show discount badge on paid plans */}
                                    {meta.pricingKey && (
                                        <span className="ml-1 text-[10px] bg-green-500 text-white font-bold px-1.5 py-0.5 rounded-full leading-tight">
                                            {YEARLY_DISCOUNT_BADGE}
                                        </span>
                                    )}
                                </div>

                                {isUpgrade && (
                                    <p className="text-xs text-muted-foreground line-through mb-4">
                                        was ₹{fullPrice}
                                    </p>
                                )}

                                {!isUpgrade && <div className="mb-4" />}

                                {/* Features */}
                                <ul className="space-y-4 mb-8">
                                    {meta.features.map((feature, i) => (
                                        <li
                                            key={i}
                                            className="flex items-center gap-3 text-sm text-foreground/70"
                                        >
                                            {feature.available ? (
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="17"
                                                    height="17"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    className="text-primary"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <circle cx="12" cy="12" r="10" />
                                                    <path d="m9 12 2 2 4-4" />
                                                </svg>
                                            ) : (
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="17"
                                                    height="17"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    className="text-foreground/70"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <circle cx="12" cy="12" r="10" />
                                                    <path d="m15 9-6 6" />
                                                    <path d="m9 9 6 6" />
                                                </svg>
                                            )}
                                            {feature.text}
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    disabled={buttonDisabled}
                                    onClick={() => handlePlanSelect(meta)}
                                    className={`w-full py-3 rounded-full text-sm transition-opacity
                                        ${
                                            buttonDisabled
                                                ? "bg-gray-300 cursor-not-allowed text-gray-500"
                                                : "bg-linear-to-r from-primary to-green-500/70 text-white hover:opacity-95"
                                        }`}
                                >
                                    {createSubscriptionMutation.isPending && !buttonDisabled
                                        ? "Processing…"
                                        : buttonLabel}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}