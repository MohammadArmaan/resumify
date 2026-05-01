"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useForgotPassword } from "@/hooks/mutations/auth/useForgotPassword";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const forgotMutation = useForgotPassword();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        setMessage("");

        try {
            const res = await forgotMutation.mutateAsync({ email });
            setMessage(res.message);

            toast.success(res.message);
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Signup failed";
            toast.error(message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-background">
            <div className="w-full max-w-md bg-card border border-border rounded-2xl p-8 shadow-sm">
                <h1 className="text-xl font-semibold text-foreground">
                    Forgot password
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Enter your email to receive reset link
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <input
                        type="email"
                        value={email}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setEmail(e.target.value)
                        }
                        placeholder="you@example.com"
                        required
                        className="w-full bg-background border border-input rounded-lg px-3.5 py-2.5 text-sm"
                    />

                    {error && (
                        <p className="text-[12px] text-destructive">{error}</p>
                    )}
                    {message && (
                        <p className="text-[12px] text-green-600">{message}</p>
                    )}

                    <button
                        type="submit"
                        disabled={forgotMutation.isPending}
                        className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg py-2.5 flex items-center justify-center gap-2"
                    >
                        {forgotMutation.isPending ? (
                            <Loader2 className="animate-spin h-4 w-4" />
                        ) : (
                            <>
                                Send reset link <ArrowRight size={14} />
                            </>
                        )}
                    </button>
                </form>

                <p className="text-sm text-muted-foreground mt-5 text-center">
                    Remembered your password?{" "}
                    <Link href="/login" className="text-green-600 underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}
