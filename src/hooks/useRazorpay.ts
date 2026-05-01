// src/hooks/useRazorpay.ts
import { useEffect, useState } from "react";

export function useRazorpay() {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if ((window as any).Razorpay) { setLoaded(true); return; }

        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = () => setLoaded(true);
        script.onerror = () => console.error("Failed to load Razorpay SDK");
        document.body.appendChild(script);

        return () => { document.body.removeChild(script); };
    }, []);

    return loaded;
}