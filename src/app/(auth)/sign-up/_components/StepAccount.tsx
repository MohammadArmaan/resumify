import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { ChangeEvent, useState, type FormEvent } from "react";
import {
    AccountFormData,
    AccountFormField,
    inputCn,
    StepAccountProps,
} from "../page";
import { useSignup } from "@/hooks/mutations/auth/useSignup";
import { useGoogleLogin } from "@/hooks/mutations/auth/useGoogleLogin";
import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function StepAccount({ onNext }: StepAccountProps) {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirm, setShowConfirm] = useState<boolean>(false);

    const [form, setForm] = useState<AccountFormData>({
        name: "",
        email: "",
        password: "",
        confirm: "",
    });

    const [error, setError] = useState<string>("");

    const signupMutation = useSignup();
    const googleLoginMutation = useGoogleLogin();

    const router = useRouter();

    const handleChange =
        (field: AccountFormField) =>
        (e: ChangeEvent<HTMLInputElement>): void => {
            setForm((prev) => ({ ...prev, [field]: e.target.value }));
        };

    const handleNext = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        if (form.password !== form.confirm) {
            setError("Passwords don't match.");
            return;
        }

        if (form.password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }

        setError("");

        try {
            await signupMutation.mutateAsync({
                fullName: form.name,
                email: form.email,
                password: form.password,
            });

            onNext(form);
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Signup failed";
            toast.error(message);
        }
    };

    return (
        <div className="space-y-4">
            {/* Google OAuth (wrapped to keep same styling) */}
            <div className="w-full">
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
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 my-2">
                <div className="h-px flex-1 bg-border" />
                <span className="text-[11px] text-muted-foreground uppercase tracking-widest">
                    or
                </span>
                <div className="h-px flex-1 bg-border" />
            </div>

            {/* Form */}
            <form onSubmit={handleNext} className="space-y-4" noValidate>
                {/* Full Name */}
                <div className="space-y-1.5">
                    <label className="text-[13px] text-foreground font-medium">
                        Full Name
                    </label>
                    <input
                        type="text"
                        value={form.name}
                        onChange={handleChange("name")}
                        required
                        placeholder="John Doe"
                        className={inputCn}
                    />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                    <label className="text-[13px] text-foreground font-medium">
                        Email
                    </label>
                    <input
                        type="email"
                        value={form.email}
                        onChange={handleChange("email")}
                        required
                        placeholder="you@example.com"
                        className={inputCn}
                    />
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                    <label className="text-[13px] text-foreground font-medium">
                        Password
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={form.password}
                            onChange={handleChange("password")}
                            required
                            placeholder="Min. 8 characters"
                            className={inputCn}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            {showPassword ? (
                                <EyeOff size={15} />
                            ) : (
                                <Eye size={15} />
                            )}
                        </button>
                    </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                    <label className="text-[13px] text-foreground font-medium">
                        Confirm Password
                    </label>
                    <div className="relative">
                        <input
                            type={showConfirm ? "text" : "password"}
                            value={form.confirm}
                            onChange={handleChange("confirm")}
                            required
                            placeholder="Re-enter password"
                            className={inputCn}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirm((prev) => !prev)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            {showConfirm ? (
                                <EyeOff size={15} />
                            ) : (
                                <Eye size={15} />
                            )}
                        </button>
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <p className="text-[12px] text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
                        {error}
                    </p>
                )}

                {/* Submit */}
                <button
                    type="submit"
                    disabled={signupMutation.isPending}
                    className="w-full bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg py-2.5 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    Continue <ArrowRight size={14} />
                </button>
            </form>
        </div>
    );
}
