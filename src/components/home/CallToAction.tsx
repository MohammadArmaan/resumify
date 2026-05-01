"use client";
import { User } from "@/types/user-types";
import { useRouter } from "next/navigation";

interface CallToActionProps {
    user: User | null | undefined;
}

export default function CallToAction({ user }: CallToActionProps) {
    const router = useRouter();
    const dynamicNavigation = user ? "/dashboard" : "/sign-up"

    return (
        <div
            id="cta"
            className="border-y border-dashed border-slate-200 w-full max-w-5xl mt-28 mx-auto px-16"
        >
            <div className="flex flex-col md:flex-row text-center md:text-left items-center justify-between gap-8 px-3 md:px-10 border-x border-dashed border-slate-200 py-20 -mt-10 -mb-10 w-full">
                <p className="text-xl font-medium max-w-sm">
                    Stop guessing what recruiters want — build a job-ready
                    resume with AI.
                </p>

                <button
                    onClick={() => router.push(dynamicNavigation)}
                    className="flex items-center gap-2 rounded-md py-3 px-5 bg-green-600 hover:bg-green-700 transition text-white"
                >
                    <span>Start Building</span>
                </button>
            </div>
        </div>
    );
}
