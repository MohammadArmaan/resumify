// ─── Step 3: Done ────────────────────────────────────────────────────────────

import { ArrowRight, Check } from "lucide-react";
import { StepDoneProps } from "../page";
import Link from "next/link";

export default function StepDone({ name }: StepDoneProps) {
    const firstName: string = name.split(" ")[0] ?? name;

    return (
        <div className="flex flex-col items-center text-center py-4 space-y-5">
            <div className="w-14 h-14 rounded-full bg-green-600/10 border border-green-600/20 flex items-center justify-center">
                <Check
                    size={24}
                    className="text-green-600 dark:text-green-500"
                    strokeWidth={2.5}
                    aria-hidden="true"
                />
            </div>
            <div>
                <h3 className="text-foreground font-semibold text-lg">
                    You&apos;re all set, {firstName}!
                </h3>
                <p className="text-muted-foreground text-sm mt-1.5">
                    Your account has been created successfully.
                </p>
            </div>
            <Link
                href="/login"
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg px-6 py-2.5 transition-colors"
            >
                Go to login <ArrowRight size={14} aria-hidden="true" />
            </Link>
        </div>
    );
}
