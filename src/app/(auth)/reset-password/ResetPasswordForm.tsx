"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { Loader2, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useResetPassword } from "@/hooks/mutations/auth/useResetPassword";
import { toast } from "sonner";

export default function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token") || "";

    const router = useRouter();

    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");

    const [show, setShow] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const resetMutation = useResetPassword();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!token) {
            setError("Invalid or missing token");
            return;
        }

        if (password !== confirm) {
            setError("Passwords do not match");
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters");
            return;
        }

        try {
            const res = await resetMutation.mutateAsync({
                token,
                password,
            });

            setSuccess(res.message);
            toast.success(res.message);

            setTimeout(() => {
                router.push("/login");
            }, 1500);
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Reset failed";
            toast.error(message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-background">
            <div className="w-full max-w-md bg-card border border-border rounded-2xl p-8 shadow-sm">
                <h1 className="text-xl font-semibold text-foreground">
                    Reset password
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Enter your new password
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    {/* Password */}
                    <div className="relative">
                        <input
                            type={show ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="New password"
                            required
                            className="w-full bg-background border border-input rounded-lg px-3.5 py-2.5 pr-10 text-sm"
                        />
                        <button
                            type="button"
                            onClick={() => setShow((p) => !p)}
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                        >
                            {show ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                    </div>

                    {/* Confirm Password */}
                    <div className="relative">
                        <input
                            type={showConfirm ? "text" : "password"}
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            placeholder="Confirm password"
                            required
                            className="w-full bg-background border border-input rounded-lg px-3.5 py-2.5 pr-10 text-sm"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirm((p) => !p)}
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                        >
                            {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                    </div>

                    {error && (
                        <p className="text-[12px] text-destructive">{error}</p>
                    )}
                    {success && (
                        <p className="text-[12px] text-green-600">{success}</p>
                    )}

                    <button
                        type="submit"
                        disabled={resetMutation.isPending}
                        className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg py-2.5 flex items-center justify-center gap-2"
                    >
                        {resetMutation.isPending ? (
                            <Loader2 className="animate-spin h-4 w-4" />
                        ) : (
                            <>
                                Reset password <ArrowRight size={14} />
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}