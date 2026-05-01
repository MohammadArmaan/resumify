"use client";
import {
    ArrowRight,

    LogOut,
    Stars,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

import { useRouter } from "next/navigation";
import { User } from "@/types/user-types";
import { useLogout } from "@/hooks/mutations/auth/uselogout";
import { Button } from "../ui/button";
import UserButton from "../UserButton";
import { toast } from "sonner";

interface HeroProps {
    user?: User | null;
}

export default function Hero({ user }: HeroProps) {
    const [menuOpen, setMenuOpen] = useState(false);

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

    return (
        <>
            <div className="min-h-screen overflow-x-hidden">
                {/* Navbar */}
                <nav className="z-50 flex items-center justify-between w-full py-4 px-4 sm:px-6 md:px-12 lg:px-20 xl:px-32 text-sm">
                    <Link href="/" className="text-4xl">
                        resumify<span className="text-primary text-5xl">.</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-8 transition duration-500 text-foreground">
                        <Link
                            href="#"
                            className="hover:text-primary transition"
                        >
                            Home
                        </Link>
                        <Link
                            href="#features"
                            className="hover:text-primary transition"
                        >
                            Features
                        </Link>
                        <Link
                            href="#testimonials"
                            className="hover:text-primary transition"
                        >
                            Testimonials
                        </Link>
                        <Link
                            href="#pricing"
                            className="hover:text-primary transition"
                        >
                            Pricing
                        </Link>
                        <Link
                            href="#cta"
                            className="hover:text-primary transition"
                        >
                            Contact
                        </Link>
                    </div>

                    {!user ? (
                        <div className="flex gap-2">
                            <Link
                                href={"/sign-up"}
                                className="hidden md:block px-6 py-2 bg-primary hover:bg-green-700 active:scale-95 transition-all rounded-full text-white"
                            >
                                Get started
                            </Link>
                            <Link
                                href={"/login"}
                                className="hidden md:block px-6 py-2 border active:scale-95 hover:bg-foreground transition-all rounded-full text-foreground hover:text-background"
                            >
                                Login
                            </Link>
                        </div>
                    ) : (
                        <div className="hidden md:flex gap-2">
                            <Link
                                href={"/dashboard"}
                                className=" px-6 py-2 bg-primary hover:bg-green-700 active:scale-95 transition-all rounded-full text-white"
                            >
                                Get started
                            </Link>
                            <UserButton />
                        </div>
                    )}
                    <div className="flex md:hidden gap-5">
                            <UserButton />
                    <button
                        onClick={() => setMenuOpen(true)}
                        className="active:scale-90 transition"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="26"
                            height="26"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="lucide lucide-menu"
                        >
                            <path d="M4 5h16M4 12h16M4 19h16" />
                        </svg>
                    </button>

                    </div>



                </nav>

                {/* Mobile Menu */}
                <div
                    className={`fixed inset-0 z-[100] bg-background/40 text-black backdrop-blur flex flex-col items-center justify-center text-lg gap-8 md:hidden transition-transform duration-300 ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
                >
                    <Link
                        href="#"
                        className="text-foreground"
                        onClick={() => setMenuOpen(false)}
                    >
                        Home
                    </Link>
                    <Link
                        href="#features"
                        className="text-foreground"
                        onClick={() => setMenuOpen(false)}
                    >
                        Features
                    </Link>
                    <Link
                        href="#testimonials"
                        className="text-foreground"
                        onClick={() => setMenuOpen(false)}
                    >
                        Testimonials
                    </Link>
                    <Link
                        href="#pricing"
                        className="text-foreground"
                        onClick={() => setMenuOpen(false)}
                    >
                        Pricing
                    </Link>
                    <Link
                        href="#cta"
                        className="text-foreground"
                        onClick={() => setMenuOpen(false)}
                    >
                        Contact
                    </Link>
                    {user && (
                        <>
                            <Link
                                href="/profile"
                                className="text-foreground"
                                onClick={() => setMenuOpen(false)}
                            >
                                Profile
                            </Link>
                            <Link
                                href="/dashboard/subscriptions"
                                className="text-foreground"
                                onClick={() => setMenuOpen(false)}
                            >
                                Subscriptions
                            </Link>
                            <Button
                                variant={"outline"}
                                className="text-red-500 hover:text-red-600 font-xl"
                                onClick={handleLogout}
                            >
                                Logout <LogOut />
                            </Button>
                        </>
                    )}
                    <button
                        onClick={() => setMenuOpen(false)}
                        className="active:ring-3 active:ring-white aspect-square size-10 p-1 items-center justify-center bg-primary hover:bg-green-700 transition text-white rounded-md flex"
                    >
                        X
                    </button>
                </div>

                {/* Hero Section */}
                <div className="relative flex flex-col items-center justify-center text-sm px-4 md:px-16 lg:px-24 xl:px-40 text-foreground">
                    <div className="absolute top-28 xl:top-10 -z-10 left-1/4 size-72 sm:size-96 xl:size-120 2xl:size-132 bg-green-300 blur-[100px] opacity-30"></div>

                    <div className="rainbow relative z-0 bg-transparent overflow-hidden p-px flex items-center justify-center border border-gray-300 dark:border-gray-700 rounded-full transition duration-300 active:scale-100 mt-28 md:mt-32">
                        <button className="flex items-center justify-center gap-3 pl-4 pr-6 py-3 text-green-700 rounded-full font-medium  backdrop-blur">
                            <div className="relative flex size-3.5 items-center justify-center">
                                <span className="absolute inline-flex h-full w-full rounded-full bg-[#ABFF7E] opacity-75 animate-ping duration-300"></span>
                                <span className="relative inline-flex size-2 rounded-full bg-[#ABFF7E]"></span>
                            </div>
                            <span className="text-xs">
                                Design ATS Enabled Resume in Minutes
                            </span>
                        </button>
                    </div>

                    {/* Headline + CTA */}
                    <h1 className="text-3xl sm:text-4xl md:text-6xl font-semibold max-w-5xl text-center mt-4 md:leading-17.5">
                        Land your dream job with{" "}
                        <span className=" bg-linear-to-r from-green-700 to-primary bg-clip-text text-transparent ">
                            AI-powered{" "}
                        </span>{" "}
                        resumes.
                    </h1>

                    <p className="max-w-md text-center text-base my-7">
                        Create, edit and download professional resumes with
                        AI-powered assistance.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-wrap items-center gap-4 ">
                        <Link
                            href={user ? "/dashboard" : "/sign-up"}
                            className="bg-primary hover:bg-green-700 text-white rounded-full px-9 h-12 m-1 ring-offset-2 ring-1 ring-green-400 flex justify-center items-center gap-2 transition-colors w-full sm:w-auto"
                        >
                            Get started
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                        <button className="flex justify-center items-center gap-2 border border-slate-400 hover:bg-green-50 dark:hover:bg-primary transition rounded-full px-7 h-12 text-foreground w-full sm:w-auto cursor-pointer">
                            <Stars className="h-4 w-4" />
                            <span>Try demo</span>
                        </button>
                    </div>

                    <p className="py-6 text-base text-muted-foreground mt-14">
                        Your next opportunity starts with a powerful resume.
                    </p>

                    <div
                        className="p-0.5 border border-primary shadow-md rounded-2xl mt-10 hover:mb-15 overflow-hidden 
    transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] 
    hover:scale-105 hover:-translate-y-2 hover:shadow-2xl"
                    >
                        <img
                            src="/hero-image.png"
                            className="w-full max-w-4xl mx-auto rounded-2xl"
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
