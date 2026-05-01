"use client";

import { useState } from "react";
import Link from "next/link";
import StepIndicator from "./_components/StepIndicator";
import StepAccount from "./_components/StepAccount";
import StepVerify from "./_components/StepVerify";
import StepDone from "./_components/StepDone";

// ─── Types ───────────────────────────────────────────────────────────────────

type StepIndex = 0 | 1 | 2;

export interface AccountFormData {
    name: string;
    email: string;
    password: string;
    confirm: string;
}

export type AccountFormField = keyof AccountFormData;

export interface StepIndicatorProps {
    current: StepIndex;
}

export interface StepAccountProps {
    onNext: (data: AccountFormData) => void;
}

export interface StepVerifyProps {
    email: string;
    onNext: () => void;
}

export interface StepDoneProps {
    name: string;
}

export interface StepHeading {
    title: string;
    sub: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

export const STEPS = ["Account", "Verify", "Done"] as const;
export type StepLabel = (typeof STEPS)[number];

const STEP_HEADINGS: Record<StepIndex, StepHeading> = {
    0: {
        title: "Create your account",
        sub: "Fill in your details to get started",
    },
    1: { title: "Verify your email", sub: "Just one last step" },
    2: { title: "Account created", sub: "" },
};

// ─── Shared input className ───────────────────────────────────────────────────

export const inputCn =
    "w-full bg-background border border-input rounded-lg px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-150";


// ─── Main Component ──────────────────────────────────────────────────────────

export default function SignupPage() {
    const [step, setStep] = useState<StepIndex>(0);
    const [userData, setUserData] = useState<AccountFormData>({
        name: "",
        email: "",
        password: "",
        confirm: "",
    });

    const heading: StepHeading = STEP_HEADINGS[step];

    const handleAccountNext = (data: AccountFormData): void => {
        setUserData(data);
        setStep(1);
    };

    const handleVerifyNext = (): void => {
        setStep(2);
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8 md:py-0">
            <div className="relative w-full max-w-105">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <div className="w-9 h-9 rounded-xl bg-linear-to-br from-green-500 to-green-600 flex items-center justify-center shadow-md">
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            aria-hidden="true"
                        >
                            <path
                                d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                </div>

                {/* Card */}
                <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
                    <StepIndicator current={step} />

                    <div className="mb-6">
                        <h1 className="text-xl font-semibold text-foreground tracking-tight">
                            {heading.title}
                        </h1>
                        {heading.sub && (
                            <p className="text-sm text-muted-foreground mt-1">
                                {heading.sub}
                            </p>
                        )}
                    </div>

                    {step === 0 && <StepAccount onNext={handleAccountNext} />}
                    {step === 1 && (
                        <StepVerify
                            email={userData.email}
                            onNext={handleVerifyNext}
                        />
                    )}
                    {step === 2 && <StepDone name={userData.name} />}
                </div>

                {/* Footer */}
                {step < 2 && (
                    <p className="text-center text-[13px] text-muted-foreground mt-5">
                        Already have an account?{" "}
                        <Link
                            href="/login"
                            className="text-green-600 dark:text-green-500 hover:underline font-medium transition-colors"
                        >
                            Sign in
                        </Link>
                    </p>
                )}
            </div>
        </div>
    );
}
