"use client";

import { useRef, useEffect, useState } from "react";
import { ResumeData } from "@/types/resume-types";
import ModernTemplate from "./resume-templates/ModernTemplate";
import MinimalTemplate from "./resume-templates/MinimalTemplate";
import MinimalImageTemplate from "./resume-templates/MinimalImageTemplate";
import PremiumTemplate from "./resume-templates/PremiumTemplate";
import ExecutiveTemplate from "./resume-templates/ExecutiveTemplate";
import ClassicTemplate from "./resume-templates/ClassicTemplate";

interface ResumePreviewProps {
    data: ResumeData;
    template: string;
    accentColor: string;
    classes?: string;
}

// A4 at 96 dpi — this is the "true" rendered size of the resume content.
// Everything else is just a scaled-down visual of this.
const A4_W = 794;
const A4_H = 1123;

function TemplateRenderer({
    data,
    template,
    accentColor,
}: {
    data: ResumeData;
    template: string;
    accentColor: string;
}) {
    switch (template) {
        case "modern":
            return <ModernTemplate data={data} accentColor={accentColor} />;
        case "minimal":
            return <MinimalTemplate data={data} accentColor={accentColor} />;
        case "minimal-image":
            return <MinimalImageTemplate data={data} accentColor={accentColor} />;
        case "premium":
            return <PremiumTemplate data={data} accentColor={accentColor} />;
        case "executive":
            return <ExecutiveTemplate data={data} accentColor={accentColor} />;
        default:
            return <ClassicTemplate data={data} accentColor={accentColor} />;
    }
}

export default function ResumePreview({
    data,
    template,
    accentColor,
    classes = "",
}: ResumePreviewProps) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);

    // ── Scale calculation ──────────────────────────────────────────────────────
    // Watch the container width and derive scale = containerWidth / A4_W.
    // Using ResizeObserver means this reacts to sidebar collapse, drawer
    // open/close, window resize — anything that changes the container.
    useEffect(() => {
        const el = wrapperRef.current;
        if (!el) return;

        const calc = () => {
            const w = el.getBoundingClientRect().width;
            if (w > 0) setScale(w / A4_W);
        };

        calc(); // run once immediately

        const ro = new ResizeObserver(calc);
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    // ── Print isolation ────────────────────────────────────────────────────────
    // The problem with visibility:hidden + visibility:visible tricks is that they
    // rely on the element being in the same stacking context as the rest of the
    // page. Any wrapper with overflow:hidden, a transform, or display:none on an
    // ancestor breaks it — and dashboard layouts almost always have these.
    //
    // Solution: inject a <div id="resume-print-portal"> directly on <body> (outside
    // the Next.js app tree entirely), then copy the resume HTML into it just before
    // the browser renders the print layout. The portal is the ONLY thing shown
    // during print — everything else on <body> is display:none.
    //
    // This means no dashboard chrome, no sidebar, no form fields ever appear in print.

    useEffect(() => {
        // 1. Inject print CSS into <head> once
        const styleId = "resume-print-style";
        if (!document.getElementById(styleId)) {
            const style = document.createElement("style");
            style.id = styleId;
            style.textContent = `
                @page {
                    size: letter;
                    margin: 0;
                }

                @media print {
                    html, body {
                        margin: 0 !important;
                        padding: 0 !important;
                        width: 8.5in !important;
                        height: 11in !important;
                        overflow: hidden !important;
                        background: white !important;
                    }

                    /* Hide every direct child of body */
                    body > * {
                        display: none !important;
                    }

                    /* Un-hide only our portal */
                    body > #resume-print-portal {
                        display: block !important;
                        position: fixed !important;
                        inset: 0 !important;
                        width: 8.5in !important;
                        height: 11in !important;
                        overflow: hidden !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        background: white !important;
                        transform: none !important;
                        zoom: 1 !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        // 2. Create the portal div on <body>
        const portalId = "resume-print-portal";
        let portal = document.getElementById(portalId);
        if (!portal) {
            portal = document.createElement("div");
            portal.id = portalId;
            portal.style.display = "none"; // invisible on screen
            document.body.appendChild(portal);
        }

        // 3. Before the browser paints the print layout, copy the latest
        //    resume HTML (from the hidden source div) into the portal.
        //    This ensures prop changes (template swap, data edit, color change)
        //    are always reflected without a stale snapshot.
        const onBeforePrint = () => {
            const source = document.getElementById("resume-print-source");
            const target = document.getElementById(portalId);
            if (source && target) {
                target.innerHTML = source.innerHTML;
            }
        };

        window.addEventListener("beforeprint", onBeforePrint);

        return () => {
            window.removeEventListener("beforeprint", onBeforePrint);
            // Remove portal when this component unmounts
            const el = document.getElementById(portalId);
            if (el && document.body.contains(el)) {
                document.body.removeChild(el);
            }
            // Leave the style tag — it's harmless and avoids a flash if the
            // component remounts quickly (e.g. hot reload).
        };
    }, []);

    return (
        <>
            {/*
             * ── SCREEN PREVIEW ───────────────────────────────────────────────
             *
             * Outer wrapper: maintains A4 aspect ratio at any container width
             * using the padding-bottom percentage trick. overflow:hidden clips
             * the scaled content to exactly this box.
             *
             * Inner content: always laid out at A4_W × A4_H px (794 × 1123).
             * CSS transform: scale(n) shrinks it visually — crucially, transform
             * does NOT compress the layout the way zoom/width-percentage does.
             * Every font size, line height, padding, and image stays at its true
             * rendered value; the whole thing is just painted smaller.
             * transform-origin: top left anchors the scale to the top-left corner
             * of the aspect ratio box so it fills from the top down.
             */}
            <div
                ref={wrapperRef}
                className="w-full relative overflow-hidden shadow-2xl"
                style={{ paddingBottom: `${(A4_H / A4_W) * 100}%` }}
            >
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: A4_W,
                        height: A4_H,
                        transformOrigin: "top left",
                        transform: `scale(${scale})`,
                    }}
                >
                    <TemplateRenderer
                        data={data}
                        template={template}
                        accentColor={accentColor}
                    />
                </div>
            </div>

            {/*
             * ── PRINT SOURCE ─────────────────────────────────────────────────
             *
             * Hidden off-screen at true A4 size with no transforms applied.
             * React keeps this in sync with props so it always has the latest
             * template/data/color. The beforeprint handler copies its innerHTML
             * into the body-level portal just before print layout is calculated.
             *
             * left: -9999px keeps it off-screen without affecting document flow.
             * visibility: hidden prevents screen readers from double-reading it.
             * pointer-events: none prevents any accidental interaction.
             */}
            <div
                id="resume-print-source"
                aria-hidden="true"
                style={{
                    position: "fixed",
                    left: "-9999px",
                    top: 0,
                    width: A4_W,
                    height: A4_H,
                    overflow: "hidden",
                    pointerEvents: "none",
                    visibility: "hidden",
                    zIndex: -1,
                }}
            >
                <TemplateRenderer
                    data={data}
                    template={template}
                    accentColor={accentColor}
                />
            </div>
        </>
    );
}