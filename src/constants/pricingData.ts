export type Plan = {
    name: string;
    monthlyPrice: number;
    yearlyPrice: number;
    mostPopular?: boolean;
    features: {
        text: string;
        available: boolean;
    }[];
};

export const pricingData: Plan[] = [
    {
        name: "Free",
        monthlyPrice: 0,
        yearlyPrice: 0,
        features: [
            { text: "2 Resume Credits", available: true },
            { text: "Basic Resume Builder", available: true },
            { text: "AI Assistance", available: false },
            { text: "Resume Upload & Parsing", available: false },
            { text: "Tokens Usage", available: false },
            { text: "ATS Score Analysis", available: false },
            { text: "Job Description Matching", available: false },
            { text: "AI Cover Letter Generator", available: false },
            { text: "2 Resume Templates", available: true },
        ],
    },

    {
        name: "Recommended",
        monthlyPrice: 100,
        yearlyPrice: 1000,
        mostPopular: true,
        features: [
            { text: "10 Resume Credits", available: true },
            { text: "AI Resume Assistance", available: true },
            { text: "Resume Upload & Parsing", available: true },
            { text: "Tokens Usage (5000 tokens/month)", available: true },
            { text: "ATS Score Analysis (5 uses/month)", available: true },
            {
                text: "Job Description Matching (5 uses/month)",
                available: true,
            },
            {
                text: "AI Cover Letter Generator (5 uses/month)",
                available: true,
            },
            { text: "Up to 5 Resume Templates", available: true },
            { text: "Basic Support", available: true },
        ],
    },

    {
        name: "Enterprise",
        monthlyPrice: 500,
        yearlyPrice: 5000,
        features: [
            { text: "100 Resume Credits", available: true },
            { text: "Unlimited AI Assistance", available: true },
            { text: "Advanced Resume Parsing", available: true },
            { text: "Tokens Usage (20000 tokens/month)", available: true },
            { text: "ATS Score Analysis (50 uses/month)", available: true },
            {
                text: "Job Description Matching (20 uses/month)",
                available: true,
            },
            {
                text: "AI Cover Letter Generator (20 uses/month)",
                available: true,
            },
            { text: "Premium Resume Templates", available: true },
            { text: "Priority Support", available: true },
        ],
    },
];
