"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import { Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useGoogleLogin } from "@/hooks/mutations/auth/useGoogleLogin";
import { useLogin } from "@/hooks/mutations/auth/useLogin";

interface LoginForm {
    email: string;
    password: string;
}

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [form, setForm] = useState<LoginForm>({ email: "", password: "" });

    const router = useRouter();

    const loginMutation = useLogin()
    const googleLoginMutation = useGoogleLogin();

    const handleChange =
        (field: keyof LoginForm) =>
        (e: ChangeEvent<HTMLInputElement>): void => {
            setForm((prev) => ({ ...prev, [field]: e.target.value }));
        };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setLoading(true);
        try {
            await loginMutation.mutateAsync({
                email: form.email,
                password: form.password,
            });
            toast.success("Login Successfull!");
            router.push("/dashboard")
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Login failed";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const togglePassword = (): void => setShowPassword((prev) => !prev);

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
            <div className="relative w-full max-w-105">
                {/* Logo mark */}
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
                    <div className="mb-7">
                        <h1 className="text-xl font-semibold text-foreground tracking-tight">
                            Welcome back
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Sign in to your account to continue
                        </p>
                    </div>

                    {/* Google OAuth */}
                    <GoogleLogin
                        onSuccess={async (credentialResponse) => {
                            try {
                                await googleLoginMutation.mutateAsync({
                                    token: credentialResponse.credential as string,
                                });

                                toast.success("Google Login Successfull!");
                                router.push("/dashboard");
                            } catch (err) {
                                const message =
                                    err instanceof Error
                                        ? err.message
                                        : "Google login failed";
                                toast.error(message);
                            }
                        }}
                        onError={() => toast.error("Google Login Failed")}
                    />

                    <div
                        className="flex items-center gap-3 my-5"
                        role="separator"
                        aria-hidden="true"
                    >
                        <div className="h-px flex-1 bg-border" />
                        <span className="text-[11px] text-muted-foreground uppercase tracking-widest">
                            or
                        </span>
                        <div className="h-px flex-1 bg-border" />
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-4"
                        noValidate
                    >
                        {/* Email */}
                        <div className="space-y-1.5">
                            <label
                                htmlFor="login-email"
                                className="text-[13px] text-foreground font-medium"
                            >
                                Email
                            </label>
                            <input
                                id="login-email"
                                type="email"
                                value={form.email}
                                onChange={handleChange("email")}
                                required
                                autoComplete="email"
                                placeholder="you@example.com"
                                className="w-full bg-background border border-input rounded-lg px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-150"
                            />
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <label
                                    htmlFor="login-password"
                                    className="text-[13px] text-foreground font-medium"
                                >
                                    Password
                                </label>
                                <Link
                                    href="/forgot-password"
                                    className="text-[12px] text-green-600 dark:text-green-500 hover:underline transition-colors"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <input
                                    id="login-password"
                                    type={showPassword ? "text" : "password"}
                                    value={form.password}
                                    onChange={handleChange("password")}
                                    required
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    className="w-full bg-background border border-input rounded-lg px-3.5 py-2.5 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-150"
                                />
                                <button
                                    type="button"
                                    onClick={togglePassword}
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff size={15} />
                                    ) : (
                                        <Eye size={15} />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg py-2.5 flex items-center justify-center gap-2 transition-colors duration-150"
                        >
                            {loading ? (
                                <Loader2
                                    className="animate-spin h-4 w-4"
                                    aria-hidden="true"
                                />
                            ) : (
                                <>
                                    Sign in{" "}
                                    <ArrowRight size={14} aria-hidden="true" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <p className="text-center text-[13px] text-muted-foreground mt-5">
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/sign-up"
                        className="text-green-600 dark:text-green-500 hover:underline font-medium transition-colors"
                    >
                        Create one
                    </Link>
                </p>
            </div>
        </div>
    );
}
