import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import { GoogleOAuthProvider } from "@react-oauth/google";

const outfit = Outfit({
    subsets: ["latin"],
    variable: "--font-outfit",
});

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

export const metadata: Metadata = {
    title: {
        default: "Resumify - Create Your Resume in Minutes",
        template: "%s | Resumify",
    },
    description:
        "Build professional, ATS-friendly resumes with AI. Create, customize, and download your resume in minutes with Resumify.",
    keywords: [
        "Resume Builder",
        "AI Resume",
        "CV Maker",
        "ATS Resume",
        "Resume Generator",
    ],
    authors: [{ name: "Resumify Team" }],
    creator: "Resumify",

    openGraph: {
        title: "Resumify - Create Your Resume in Minutes",
        description:
            "Build professional resumes with AI. Fast, modern, and ATS-friendly.",
        url: "https://yourdomain.com", // 🔁 replace
        siteName: "Resumify",
        images: [
            {
                url: "/og-image.png", // 🔁 add this image in public/
                width: 1200,
                height: 630,
                alt: "Resumify Resume Builder",
            },
        ],
        locale: "en_US",
        type: "website",
    },

    twitter: {
        card: "summary_large_image",
        title: "Resumify - AI Resume Builder",
        description: "Create job-winning resumes with AI in minutes.",
        images: ["/og-image.png"], // 🔁 same image
    },

    metadataBase: new URL("https://yourdomain.com"), // 🔁 replace
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html
            lang="en"
            suppressHydrationWarning
            className={`${outfit.variable} h-full antialiased`}
        >
            <body className="min-h-full flex flex-col font-sans">
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                >
                    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID!}>
                        <Toaster position="top-center" richColors />
                        <ReactQueryProvider>{children}</ReactQueryProvider>
                    </GoogleOAuthProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
