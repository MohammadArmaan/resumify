"use client";
import { useEffect, useState } from "react";

export function LoadingScreen() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-10">
                {/* Orbit system */}
                <div className="relative w-40 h-40 flex items-center justify-center">
                    {/* Pulse rings */}
                    {[0, 0.7, 1.4].map((delay, i) => (
                        <span
                            key={i}
                            className="absolute w-[72px] h-[72px] rounded-full border border-green-400 animate-ping"
                            style={{
                                animationDelay: `${delay}s`,
                                animationDuration: "2s",
                            }}
                        />
                    ))}

                    {/* Static orbit tracks */}
                    {[
                        "w-[76px] h-[76px]",
                        "w-[104px] h-[104px]",
                        "w-[132px] h-[132px]",
                    ].map((size, i) => (
                        <span
                            key={i}
                            className={`absolute ${size} rounded-full border border-border/30`}
                        />
                    ))}

                    {/* Orbiting dots */}
                    <span className="absolute w-2 h-2 rounded-full bg-green-500 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 [animation:orbit_2.8s_linear_infinite]" />
                    <span className="absolute w-1.5 h-1.5 rounded-full bg-emerald-500 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 [animation:orbit2_4s_linear_infinite]" />
                    <span className="absolute w-[5px] h-[5px] rounded-full bg-lime-400 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 [animation:orbit3_6s_linear_infinite]" />

                    {/* Center resume icon */}
                    <div className="relative z-10 w-11 h-11 bg-green-100 dark:bg-green-950 rounded-xl flex items-center justify-center animate-pulse">
                        <svg
                            width="22"
                            height="26"
                            viewBox="0 0 22 26"
                            fill="none"
                        >
                            <rect
                                x="1"
                                y="1"
                                width="20"
                                height="24"
                                rx="3"
                                fill="none"
                                stroke="#22c55e"
                                strokeWidth="1.5"
                            />
                            <rect
                                x="4"
                                y="7"
                                width="10"
                                height="1.5"
                                rx="0.75"
                                fill="#22c55e"
                            />
                            <rect
                                x="4"
                                y="11"
                                width="14"
                                height="1.5"
                                rx="0.75"
                                fill="#86efac"
                            />
                            <rect
                                x="4"
                                y="15"
                                width="12"
                                height="1.5"
                                rx="0.75"
                                fill="#86efac"
                            />
                            <rect
                                x="4"
                                y="19"
                                width="8"
                                height="1.5"
                                rx="0.75"
                                fill="#86efac"
                            />
                            <path
                                d="M14 1L20 7H14V1Z"
                                fill="#bbf7d0"
                                stroke="#22c55e"
                                strokeWidth="1.5"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                </div>

                {/* Text + progress */}
                <div className="flex flex-col items-center gap-3">
                    <p className="text-base font-medium text-foreground">
                        Getting things ready for you
                    </p>
                    <CyclingLabel />
                    <div className="w-48 h-[3px] bg-border rounded-full overflow-hidden">
                        <div className="h-full w-2/5 bg-green-500 rounded-full animate-[shimmer_2.4s_ease-in-out_infinite]" />
                    </div>
                </div>
            </div>
        </div>
    );
}

const STEPS = [
    "Warming things up...",
    "Making things awesome...",
    "Tuning performance...",
    "Almost there...",
];
function CyclingLabel() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const id = setInterval(
            () => setIndex((i) => (i + 1) % STEPS.length),
            2400,
        );
        return () => clearInterval(id);
    }, []);

    return (
        <p
            key={index}
            className="text-[13px] text-muted-foreground animate-[fadeSlideUp_2.4s_ease-in-out]"
        >
            {STEPS[index]}
        </p>
    );
}
