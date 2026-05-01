"use client";
import { BadgeDollarSignIcon } from "lucide-react";
import { useState } from "react";
import Title from "./Title";
import { User } from "@/types/user-types";
import { useRouter } from "next/navigation";
import { Plan, pricingData } from "@/constants/pricingData";

interface PricingProps {
    user: User | null | undefined;
}

export default function Pricing({ user }: PricingProps) {
    const [isYearly, setIsYearly] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

    const router = useRouter();

    const handlePlanSelect = (plan: Plan) => {
        setSelectedPlan(plan);

        const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;

        console.log("Selected Plan:", plan.name);
        console.log("Billing:", isYearly ? "Yearly" : "Monthly");
        console.log("Amount:", price);
        console.log(selectedPlan)

        // ✅ Routing logic
        if (!user) {
            router.push("/login");
            return;
        }

        if (plan.name === "Free") {
            router.push("/dashboard");
        } else {
            router.push("/dashboard/subscriptions");
        }
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
                title={"Simple, transparent pricing"}
                description={
                    "Choose a plan based on your resume needs — from basic creation to advanced AI-powered optimization."
                }
            />

            {/* Toggle */}
            <div className="relative p-1 bg-background border border-gray-200 rounded-full inline-flex items-center mb-16 w-60">
                <div
                    className={`absolute -z-10 w-[calc(50%-4px)] h-13.25 rounded-full bg-linear-to-r from-green-700 to-green-400/70 transition-transform duration-300 ease-in-out pointer-events-none
                    ${isYearly ? "translate-x-full" : "translate-x-0"}`}
                ></div>

                <button
                    onClick={() => setIsYearly(false)}
                    className={`relative bg-background z-10 flex-1 py-2.5 cursor-pointer rounded-full text-sm font-medium text-center transition-colors duration-300
                    ${!isYearly ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
                >
                    Monthly
                </button>

                <button
                    onClick={() => setIsYearly(true)}
                    className={`relative z-10 flex-1 py-2.5 cursor-pointer rounded-full text-sm font-medium text-center flex items-center justify-center gap-1 transition-colors duration-300
                    ${isYearly ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
                >
                    Yearly
                    <span className="text-xs">Save more</span>
                </button>
            </div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full items-end">
                {pricingData.map((plan, index) => {
                    const price = isYearly
                        ? plan.yearlyPrice
                        : plan.monthlyPrice;

                    return (
                        <div
                            key={index}
                            className={
                                plan.mostPopular
                                    ? "bg-linear-to-r from-primary to-green-300 rounded-3xl p-2 shadow-xl hover:shadow-lg transition-shadow"
                                    : ""
                            }
                        >
                            {plan.mostPopular && (
                                <p className="text-center text-green-800 font-bold text-sm py-1.5">
                                    Most Popular
                                </p>
                            )}

                            <div
                                className={`rounded-3xl p-6 bg-background ${!plan.mostPopular ? "border border-neutral-200 hover:shadow-lg transition-shadow" : ""}`}
                            >
                                <h3 className="text-foreground/70 text-sm mb-6">
                                    {plan.name}
                                </h3>

                                <div className="flex items-baseline gap-1 mb-8">
                                    <span className="text-[28px] text-foreground">
                                        ₹{price}
                                    </span>
                                    <span className="text-foreground/700 text-xs">
                                        {isYearly ? "/ year" : "/ month"}
                                    </span>
                                </div>

                                <ul className="space-y-4 mb-8">
                                    {plan.features.map((feature, i) => (
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
                                                    <circle
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                    />
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
                                                    <circle
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                    />
                                                    <path d="m15 9-6 6" />
                                                    <path d="m9 9 6 6" />
                                                </svg>
                                            )}

                                            {feature.text}
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    onClick={() => handlePlanSelect(plan)}
                                    className="w-full cursor-pointer py-3 rounded-full bg-linear-to-r from-primary to-green-500/70 text-white text-sm hover:opacity-95 transition-opacity"
                                >
                                    {plan.name === "Free"
                                        ? "Start Free"
                                        : "Get Started"}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
