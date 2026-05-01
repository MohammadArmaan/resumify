"use client";
import Banner from "@/components/home/Banner";
import CallToAction from "@/components/home/CallToAction";
import Features from "@/components/home/Features";
import Footer from "@/components/home/Footer";
import Hero from "@/components/home/Hero";
import Pricing from "@/components/home/Pricing";
import Testimonials from "@/components/home/Testimonials";
import { LoadingScreen } from "@/components/LoadingScreen";
import { useUser } from "@/hooks/queries/useUser";
import useActiveSection from "@/hooks/useActiveSection";

export default function HomePage() {
    const activeSection = useActiveSection([
        "features",
        "testimonials",
        "pricing",
        "contact",
    ]);
    console.log("Active:", activeSection);

    const { data, isLoading } = useUser();
    const user = data?.user;

    if (isLoading) {
        return <LoadingScreen />;
    }

    return (
        <div>
            <Banner />
            <Hero user={user} />
            <Features />
            <Testimonials />
            <Pricing user={user} />
            <CallToAction user={user} />
            <Footer user={user} />
        </div>
    );
}
