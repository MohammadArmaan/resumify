"use client";

import { useState, useEffect } from "react";
import {
    Eye,
    EyeOff,
    Loader2,
    User,
    KeyRound,
    BarChart3,
    CreditCard,
    FileText,
    CheckCircle2,
    BrainCircuit,
    ScanSearch,
    BadgeCheck,
    Coins,
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { useUser } from "@/hooks/queries/useUser";
import { useUpdateProfile } from "@/hooks/mutations/auth/useUpdateProfile";
import { useGoogleLogin } from "@/hooks/mutations/auth/useGoogleLogin";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import { ProfileImageUpload } from "./_components/ProfileImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Zoom from "react-medium-image-zoom";

// ─── Types ────────────────────────────────────────────────────────────────────

interface UserData {
    fullName: string;
    email: string;
    profilePhoto?: string | null;
    passwordHash?: string | null;
    googleId?: string | null;
    credits: number;
    tokensRemaining: number;
    atsScoreChecks: number;
    jobDescriptionMatchings: number;
    coverLetterGenerations: number;
    isSubscribed: boolean;
}

interface PasswordInputProps {
    value: string;
    setValue: (v: string) => void;
    show: boolean;
    setShow: (v: boolean | ((prev: boolean) => boolean)) => void;
    placeholder: string;
    label: string;
}

interface StatCardProps {
    label: string;
    value: string | number;
    icon: React.ReactNode;
    accent: string;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function PasswordInput({
    value,
    setValue,
    show,
    setShow,
    placeholder,
    label,
}: PasswordInputProps) {
    return (
        <div className="space-y-1.5">
            <Label className="text-sm text-muted-foreground">{label}</Label>
            <div className="relative">
                <Input
                    type={show ? "text" : "password"}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={placeholder}
                    className="pr-10"
                />
                <button
                    type="button"
                    onClick={() => setShow((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                    {show ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
            </div>
        </div>
    );
}

function StatCard({ label, value, icon, accent }: StatCardProps) {
    return (
        <div
            className={`flex items-center gap-3 rounded-xl border bg-card p-4 transition-shadow hover:shadow-sm`}
        >
            <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${accent}`}
            >
                {icon}
            </div>
            <div className="min-w-0">
                <p className="text-xs text-muted-foreground truncate">
                    {label}
                </p>
                <p className="text-base font-semibold leading-tight">{value}</p>
            </div>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProfilePage() {
    const { data } = useUser();
    const user = data?.user as UserData | undefined;

    const updateProfile = useUpdateProfile();
    const googleLoginMutation = useGoogleLogin();

    const [fullName, setFullName] = useState("");
    const [profilePhoto, setProfilePhoto] = useState("");

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [show1, setShow1] = useState(false);
    const [show2, setShow2] = useState(false);
    const [show3, setShow3] = useState(false);

    useEffect(() => {
        if (user) {
            setFullName(user.fullName);
            setProfilePhoto(user.profilePhoto || "");
        }
    }, [user]);

    if (!user) return null;

    const hasPassword = !!user.passwordHash;
    const hasGoogle = !!user.googleId;

    const isDirty =
        fullName !== user.fullName ||
        profilePhoto !== (user.profilePhoto ?? "") ||
        newPassword.length > 0;

    const initials = user.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    const handleUpdate = async () => {
        try {
            if (newPassword && newPassword !== confirmPassword) {
                toast.error("Passwords do not match");
                return;
            }
            await updateProfile.mutateAsync({
                fullName,
                profilePhoto,
                ...(hasPassword && newPassword
                    ? { currentPassword, newPassword }
                    : {}),
            });
            toast.success("Profile updated successfully");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err: unknown) {
            const message =
                err instanceof Error ? err.message : "Update failed";
            toast.error(message);
        }
    };

    const stats: StatCardProps[] = [
        {
            label: "Resume Credits",
            value: user.credits,
            icon: <CreditCard size={16} className="text-blue-600" />,
            accent: "bg-blue-50 dark:bg-blue-950",
        },
        {
            label: "Tokens Remaining",
            value: user.tokensRemaining?.toLocaleString() ?? 0,
            icon: <Coins size={16} className="text-amber-600" />,
            accent: "bg-amber-50 dark:bg-amber-950",
        },
        {
            label: "ATS Score Checks",
            value: user.atsScoreChecks,
            icon: <ScanSearch size={16} className="text-purple-600" />,
            accent: "bg-purple-50 dark:bg-purple-950",
        },
        {
            label: "JD Matchings",
            value: user.jobDescriptionMatchings,
            icon: <BrainCircuit size={16} className="text-green-600" />,
            accent: "bg-green-50 dark:bg-green-950",
        },
        {
            label: "Cover Letters",
            value: user.coverLetterGenerations,
            icon: <FileText size={16} className="text-rose-600" />,
            accent: "bg-rose-50 dark:bg-rose-950",
        },
        {
            label: "Plan",
            value: user.isSubscribed ? "Pro" : "Free",
            icon: (
                <BadgeCheck
                    size={16}
                    className={
                        user.isSubscribed
                            ? "text-emerald-600"
                            : "text-slate-400"
                    }
                />
            ),
            accent: user.isSubscribed
                ? "bg-emerald-50 dark:bg-emerald-950"
                : "bg-slate-100 dark:bg-slate-800",
        },
    ];

    return (
        <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">
                    Profile Settings
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Manage your account details and preferences.
                </p>
            </div>

            {/* ── Personal Info ─────────────────────────────────────────── */}
            <Card>
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-2">
                        <User size={16} className="text-muted-foreground" />
                        <CardTitle className="text-base">
                            Personal Info
                        </CardTitle>
                    </div>
                    <CardDescription>
                        Update your name and profile photo.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                    {/* Avatar row */}
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16 border-2 border-border">
                                <AvatarImage
                                    src={profilePhoto || undefined}
                                    alt={user.fullName}
                                />

                                <AvatarFallback className="text-sm font-semibold bg-muted">
                                    {initials}
                                </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                            <p className="text-sm font-medium">
                                {user.fullName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {user.email}
                            </p>
                            <ProfileImageUpload
                                onUpload={(url: string) => {
                                    setProfilePhoto(url);
                                    updateProfile.mutate({ profilePhoto: url });
                                }}
                            />
                        </div>
                    </div>

                    <Separator />

                    {/* Fields */}
                    <div className="grid gap-4">
                        <div className="space-y-1.5">
                            <Label>Full Name</Label>
                            <Input
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Your name"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Email</Label>
                            <Input
                                value={user.email}
                                disabled
                                className="text-muted-foreground"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* ── Google Account ────────────────────────────────────────── */}
            <Card>
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-2">
                        <FcGoogle size={16} />
                        <CardTitle className="text-base">
                            Google Account
                        </CardTitle>
                    </div>
                    <CardDescription>
                        Connect Google for one-click sign-in.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {hasGoogle ? (
                        <div className="flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/40 dark:border-emerald-800 px-4 py-3">
                            <CheckCircle2
                                size={16}
                                className="text-emerald-600 shrink-0"
                            />
                            <div>
                                <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
                                    Google connected
                                </p>
                                <p className="text-xs text-emerald-600 dark:text-emerald-400">
                                    Your account is verified via Google.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <GoogleLogin
                            onSuccess={async (credentialResponse) => {
                                try {
                                    await googleLoginMutation.mutateAsync({
                                        token: credentialResponse.credential as string,
                                    });
                                    toast.success("Google connected!");
                                } catch (err: unknown) {
                                    const message =
                                        err instanceof Error
                                            ? err.message
                                            : "Failed";
                                    toast.error(message);
                                }
                            }}
                            onError={() => toast.error("Google sign-in failed")}
                        />
                    )}
                </CardContent>
            </Card>

            {/* ── Change Password ───────────────────────────────────────── */}
            {hasPassword && (
                <Card>
                    <CardHeader className="pb-4">
                        <div className="flex items-center gap-2">
                            <KeyRound
                                size={16}
                                className="text-muted-foreground"
                            />
                            <CardTitle className="text-base">
                                Change Password
                            </CardTitle>
                        </div>
                        <CardDescription>
                            Choose a strong password you don&apos;t use elsewhere.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <PasswordInput
                            label="Current Password"
                            value={currentPassword}
                            setValue={setCurrentPassword}
                            show={show1}
                            setShow={setShow1}
                            placeholder="••••••••"
                        />
                        <PasswordInput
                            label="New Password"
                            value={newPassword}
                            setValue={setNewPassword}
                            show={show2}
                            setShow={setShow2}
                            placeholder="••••••••"
                        />
                        <PasswordInput
                            label="Confirm New Password"
                            value={confirmPassword}
                            setValue={setConfirmPassword}
                            show={show3}
                            setShow={setShow3}
                            placeholder="••••••••"
                        />
                    </CardContent>
                </Card>
            )}

            {/* ── Usage Stats ───────────────────────────────────────────── */}
            <Card>
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <BarChart3
                                size={16}
                                className="text-muted-foreground"
                            />
                            <CardTitle className="text-base">
                                Usage & Plan
                            </CardTitle>
                        </div>
                        <Badge
                            variant={
                                user.isSubscribed ? "default" : "secondary"
                            }
                        >
                            {user.isSubscribed ? "Pro" : "Free"}
                        </Badge>
                    </div>
                    <CardDescription>
                        Your current usage limits and plan details.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {stats.map((stat) => (
                            <StatCard key={stat.label} {...stat} />
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* ── Save ─────────────────────────────────────────────────── */}
            <Button
                onClick={handleUpdate}
                disabled={updateProfile.isPending || !isDirty}
                className="w-full"
                size="lg"
            >
                {updateProfile.isPending ? (
                    <>
                        <Loader2 size={16} className="animate-spin mr-2" />
                        Saving…
                    </>
                ) : (
                    "Save Changes"
                )}
            </Button>
        </div>
    );
}
