"use client";
import { FaXTwitter } from "react-icons/fa6";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { LogOut, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Link from "next/link";
import { User } from "@/types/user-types";
import { Button } from "../ui/button";
import { useLogout } from "@/hooks/mutations/auth/uselogout";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface FooterProps {
    user: User | null | undefined;
}

export default function Footer({ user }: FooterProps) {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    const router = useRouter();

    const logoutMutation = useLogout();

    const handleLogout = async () => {
        try {
            await logoutMutation.mutateAsync();

            toast.success("Logged Out Successfully!");

            router.push("/login");
        } catch (err) {
            console.error("Logout failed", err);
        }
    };

    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    return (
        <footer className="border-t bg-linear-to-r from-background to-primary/60 border-border mt-20">
            <div className="w-full px-6 md:px-10 py-12">
                {/* Top Section */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                    {/* Brand */}
                    <div className="flex flex-col gap-2">
                        <Link href="/" className="text-4xl mb-5">
                            resumify
                            <span className="text-primary text-5xl">.</span>
                        </Link>
                        <p className="text-sm text-muted-foreground max-w-xs">
                            Build professional, ATS-friendly resumes with AI and
                            land your next opportunity faster.
                        </p>
                    </div>

                    {/* Product */}
                    <div>
                        <h4 className="font-semibold text-foreground mb-4">
                            Product
                        </h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <a
                                    href="#features"
                                    className="hover:text-primary"
                                >
                                    Features
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#pricing"
                                    className="hover:text-primary"
                                >
                                    Pricing
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#testimonials"
                                    className="hover:text-primary"
                                >
                                    Testimonials
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold text-foreground mb-4">
                            Quick Links
                        </h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link href="/" className="hover:text-primary">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={user ? "/dashboard" : "/sign-up"}
                                    className="hover:text-primary"
                                >
                                    Get Started
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/login"
                                    className="hover:text-primary"
                                >
                                    Login
                                </Link>
                            </li>
                            {user && (
                                <>
                                    <li>
                                        <Link
                                            href="/profile"
                                            className="hover:text-primary"
                                        >
                                            Profile
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/dashboard/subscriptions"
                                            className="hover:text-primary"
                                        >
                                            Subscriptions
                                        </Link>
                                    </li>
                                    <li>
                                        <Button
                                            onClick={handleLogout}
                                            variant={"outline"}
                                            className="text-red-500 hover:bg-red-500 hover:text-white"
                                        >
                                            <LogOut />
                                            Logout
                                        </Button>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>

                    {/* Social + Theme Toggle */}
                    <div>
                        <h4 className="font-semibold text-foreground mb-4">
                            Connect
                        </h4>

                        <div className="flex gap-4 mb-4">
                            <a
                                href="#"
                                className="p-2 rounded-md border border-border hover:bg-background transition"
                            >
                                <FaGithub className="h-5 w-5" />
                            </a>
                            <a
                                href="#"
                                className="p-2 rounded-md border border-border hover:bg-background transition"
                            >
                                <FaLinkedin className="h-5 w-5" />
                            </a>
                            <a
                                href="#"
                                className="p-2 rounded-md border border-border hover:bg-background transition"
                            >
                                <FaXTwitter className="h-5 w-5" />
                            </a>
                        </div>

                        {/* 🌙 Theme Toggle */}
                        <button
                            onClick={() =>
                                setTheme(theme === "dark" ? "light" : "dark")
                            }
                            className="flex items-center gap-2 px-4 py-2 rounded-md border border-border hover:bg-muted transition text-sm"
                        >
                            {theme === "dark" ? (
                                <>
                                    <Sun className="h-4 w-4" />
                                    Light Mode
                                </>
                            ) : (
                                <>
                                    <Moon className="h-4 w-4" />
                                    Dark Mode
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="mt-10 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
                    <p>
                        © {new Date().getFullYear()} Resumify. All
                        rights reserved.
                    </p>

                    <div className="flex gap-4">
                        <a href="#" className="hover:text-primary">
                            Privacy Policy
                        </a>
                        <a href="#" className="hover:text-primary">
                            Terms of Service
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
