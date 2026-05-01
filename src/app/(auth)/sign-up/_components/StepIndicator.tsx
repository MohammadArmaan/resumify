// ─── StepIndicator ───────────────────────────────────────────────────────────

import { Check } from "lucide-react";
import { StepIndicatorProps, StepLabel, STEPS } from "../page";

export default function StepIndicator({ current }: StepIndicatorProps) {
    return (
        <div
            className="flex items-center mb-8"
            role="list"
            aria-label="Sign-up steps"
        >
            {STEPS.map((label: StepLabel, i: number) => {
                const done: boolean = i < current;
                const active: boolean = i === current;

                return (
                    <div
                        key={label}
                        className="flex items-center"
                        role="listitem"
                    >
                        <div className="flex flex-col items-center gap-1.5">
                            <div
                                aria-current={active ? "step" : undefined}
                                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-200 ${
                                    done
                                        ? "bg-green-600 text-white"
                                        : active
                                          ? "border-2 border-green-600 text-green-600 bg-background"
                                          : "border border-border text-muted-foreground bg-background"
                                }`}
                            >
                                {done ? (
                                    <Check
                                        size={13}
                                        strokeWidth={2.5}
                                        aria-hidden="true"
                                    />
                                ) : (
                                    <span aria-hidden="true">{i + 1}</span>
                                )}
                            </div>
                            <span
                                className={`text-[11px] font-medium tracking-wide transition-colors ${
                                    active
                                        ? "text-foreground"
                                        : done
                                          ? "text-green-600 dark:text-green-500"
                                          : "text-muted-foreground"
                                }`}
                            >
                                {label}
                            </span>
                        </div>

                        {/* Connector */}
                        {i < STEPS.length - 1 && (
                            <div
                                aria-hidden="true"
                                className="w-16 h-px mx-1 mb-5 transition-all duration-300"
                                style={{
                                    background:
                                        i < current
                                            ? "rgb(22 163 74)" // green-600
                                            : "hsl(var(--border))",
                                }}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}