import { useUser } from "@/hooks/queries/useUser";
import { Check, Crown, Layout } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface TemplateSelectorProps {
    selectedTemplate?: string;
    onChange: (template: string) => void;
}

type PricingTier = "FREE" | "RECOMMENDED" | "ENTERPRISE";

type Template = {
    id: string;
    name: string;
    preview: string;
    isSubscribed: boolean;
    pricing: PricingTier;
};

const templates: Template[] = [
    {
        id: "classic",
        name: "Classic",
        preview:
            "A clean traditional resume layout with timeless structure, balanced spacing, and professional readability for any role.",
        isSubscribed: false,
        pricing: "FREE",
    },
    {
        id: "modern",
        name: "Modern",
        preview:
            "Sleek contemporary design with smart color accents, polished hierarchy, and modern typography for standout applications.",
        isSubscribed: true,
        pricing: "RECOMMENDED",
    },
    {
        id: "minimal-image",
        name: "Minimal Image",
        preview:
            "Minimal one-column layout featuring profile image placement, clean typography, and elegant spacing for personal branding.",
        isSubscribed: true,
        pricing: "RECOMMENDED",
    },
    {
        id: "minimal",
        name: "Minimal",
        preview:
            "Ultra-clean distraction-free format that keeps focus on achievements, skills, and experience with crisp alignment.",
        isSubscribed: false,
        pricing: "FREE",
    },
    {
        id: "executive",
        name: "Executive",
        preview:
            "Editorial magazine-inspired resume with bold hierarchy, refined grids, accent dividers, and premium polished presentation.",
        isSubscribed: true,
        pricing: "RECOMMENDED",
    },
    {
        id: "premium",
        name: "Premium",
        preview:
            "Luxury dark-sidebar executive layout with crisp contrast, elite spacing, refined section rules, and boardroom-ready authority.",
        isSubscribed: true,
        pricing: "ENTERPRISE",
    },
];

export default function TemplateSelector({
    selectedTemplate = "classic",
    onChange,
}: TemplateSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
    const buttonRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { data } = useUser();

    const user = data?.user;
    const userSubscribed = user?.isSubscribed ?? false;
    const userPlan = (user?.pricing ?? "FREE") as PricingTier;

    function canUseTemplate(template: Template) {
        if (template.pricing === "FREE") return true;
        if (!userSubscribed) return false;
        if (userPlan === "ENTERPRISE") return true;
        if (userPlan === "RECOMMENDED" && template.pricing === "RECOMMENDED") return true;
        return false;
    }

    // Recalculate dropdown position whenever it opens or window resizes/scrolls
    function updatePosition() {
        if (!buttonRef.current) return;
        const rect = buttonRef.current.getBoundingClientRect();
        const dropdownWidth = 320;
        const viewportWidth = window.innerWidth;

        // Prefer right-aligned; flip to left-align if it would overflow
        const rightAligned = rect.right - dropdownWidth;
        const left = rightAligned < 8 ? rect.left : rightAligned;

        setDropdownStyle({
            position: "fixed",
            top: rect.bottom + 8,
            left: Math.max(8, Math.min(left, viewportWidth - dropdownWidth - 8)),
            width: Math.min(dropdownWidth, viewportWidth - 16),
            zIndex: 9999,
        });
    }

    useEffect(() => {
        if (isOpen) {
            updatePosition();
            window.addEventListener("resize", updatePosition);
            window.addEventListener("scroll", updatePosition, true);
        }
        return () => {
            window.removeEventListener("resize", updatePosition);
            window.removeEventListener("scroll", updatePosition, true);
        };
    }, [isOpen]);

    // Close on outside click
    useEffect(() => {
        if (!isOpen) return;
        function handleClickOutside(e: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    const dropdown = isOpen ? (
        <div
            ref={dropdownRef}
            style={dropdownStyle}
            className="p-3 space-y-3 bg-background rounded-md border shadow-lg overflow-y-auto max-h-[80vh]"
        >
            {templates.map((template) => {
                const allowed = canUseTemplate(template);

                return (
                    <button
                        key={template.id}
                        disabled={!allowed}
                        onClick={() => {
                            if (!allowed) return;
                            onChange(template.id);
                            setIsOpen(false);
                        }}
                        className={`relative w-full text-left p-3 border rounded-md transition-all
                            ${
                                selectedTemplate === template.id
                                    ? "border-blue-500 bg-blue-50"
                                    : "border-border hover:border-blue-300 hover:bg-muted"
                            }
                            ${!allowed ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                    >
                        {selectedTemplate === template.id && (
                            <div className="absolute top-2 right-2">
                                <div className="size-5 bg-blue-500 rounded-full flex items-center justify-center">
                                    <Check className="size-3 text-white" />
                                </div>
                            </div>
                        )}

                        <div className="flex items-center gap-2">
                            <h4 className="font-medium text-sm">{template.name}</h4>
                            {template.pricing !== "FREE" && (
                                <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                                    <Crown className="size-3" />
                                    {template.pricing === "RECOMMENDED" ? "PRO" : "ENTERPRISE"}
                                </span>
                            )}
                        </div>

                        <p className="mt-2 p-2 bg-muted rounded text-xs text-muted-foreground leading-relaxed">
                            {template.preview}
                        </p>
                    </button>
                );
            })}
        </div>
    ) : null;

    return (
        <div className="relative">
            <button
                ref={buttonRef}
                onClick={() => setIsOpen((open) => !open)}
                className="flex items-center gap-1 text-sm text-blue-600 bg-gradient-to-br from-blue-50 to-blue-100 ring-1 ring-blue-300 hover:ring-blue-400 transition-all px-3 py-2 rounded-lg"
            >
                <Layout size={14} />
                <span className="max-sm:hidden">Template</span>
            </button>

            {/* Portal — renders outside all overflow-hidden ancestors */}
            {typeof document !== "undefined" && createPortal(dropdown, document.body)}
        </div>
    );
}