import { ArrowRight, Loader2, Mail } from "lucide-react";
import { ChangeEvent, useState, type FormEvent } from "react";
import { inputCn, StepVerifyProps } from "../page";
import { useGenerateOtp } from "@/hooks/mutations/auth/useGenerateOtp";
import { useVerifyOtp } from "@/hooks/mutations/auth/useVerifyOtp";
import { toast } from "sonner";

export default function StepVerify({ email, onNext }: StepVerifyProps) {
    const [otp, setOtp] = useState<string>("");
    const [sent, setSent] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const generateOtpMutation = useGenerateOtp();
    const verifyOtpMutation = useVerifyOtp();

    const sendOtp = async (): Promise<void> => {
        setError("");
        try {
            await generateOtpMutation.mutateAsync({
                email,
            });
            setSent(true);
            toast.success("We have sent OTP to your email!");
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Failed to send OTP";
            toast.error(message);
        }
    };

    const handleOtpChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setOtp(e.target.value);
    };

    const handleVerify = async (
        e: FormEvent<HTMLFormElement>,
    ): Promise<void> => {
        e.preventDefault();

        if (!sent) {
            setError("Please send the verification code first.");
            return;
        }

        if (otp.trim().length < 4) {
            setError("Enter the code sent to your email.");
            return;
        }

        setError("");

        try {
            await verifyOtpMutation.mutateAsync({
                email,
                otp,
            });

            toast.success("OTP Verified!");

            onNext();
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Invalid or expired OTP";
            toast.error(message);
        }
    };

    return (
        <form onSubmit={handleVerify} className="space-y-4" noValidate>
            {/* Info box */}
            <div className="flex gap-3 bg-muted border border-border rounded-lg p-4">
                <Mail
                    size={16}
                    className="text-muted-foreground mt-0.5 shrink-0"
                    aria-hidden="true"
                />
                <div>
                    <p className="text-[13px] text-muted-foreground">
                        We&apos;ll send a verification code to
                    </p>
                    <p className="text-[13px] text-foreground font-medium mt-0.5">
                        {email}
                    </p>
                </div>
            </div>

            {/* Send OTP */}
            {!sent ? (
                <button
                    type="button"
                    onClick={sendOtp}
                    disabled={generateOtpMutation.isPending}
                    className="w-full bg-background hover:bg-muted border border-border text-foreground text-sm rounded-lg py-2.5 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                    {generateOtpMutation.isPending ? (
                        <Loader2
                            className="animate-spin h-4 w-4"
                            aria-hidden="true"
                        />
                    ) : (
                        "Send verification code"
                    )}
                </button>
            ) : (
                <div className="space-y-1.5">
                    <label
                        htmlFor="otp-input"
                        className="text-[13px] text-foreground font-medium"
                    >
                        Verification code
                    </label>
                    <input
                        id="otp-input"
                        type="text"
                        inputMode="numeric"
                        value={otp}
                        onChange={handleOtpChange}
                        maxLength={6}
                        autoComplete="one-time-code"
                        placeholder="Enter code"
                        className={`${inputCn} tracking-widest`}
                    />
                    <button
                        type="button"
                        onClick={sendOtp}
                        disabled={generateOtpMutation.isPending}
                        className="text-[12px] text-green-600 dark:text-green-500 hover:underline transition-colors disabled:opacity-50"
                    >
                        Resend code
                    </button>
                </div>
            )}

            {error && (
                <p
                    role="alert"
                    className="text-[12px] text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2"
                >
                    {error}
                </p>
            )}

            <button
                type="submit"
                disabled={verifyOtpMutation.isPending || !sent}
                className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg py-2.5 flex items-center justify-center gap-2 transition-colors duration-150"
            >
                {verifyOtpMutation.isPending ? (
                    <Loader2
                        className="animate-spin h-4 w-4"
                        aria-hidden="true"
                    />
                ) : (
                    <>
                        Verify &amp; continue{" "}
                        <ArrowRight size={14} aria-hidden="true" />
                    </>
                )}
            </button>
        </form>
    );
}
