import { useUser } from "@/hooks/queries/useUser";
import { Check, Crown, Palette } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";

interface ColorPickerProps {
    selectedColor?: string;
    onChange: (color: string) => void;
}

type ColorItem = {
    name: string;
    value: string;
    isSubscribed: boolean;
};

const colors: ColorItem[] = [
    { name: "Black",   value: "#1F2937", isSubscribed: false },
    { name: "Green",   value: "#10B981", isSubscribed: false },
    { name: "Blue",    value: "#3B82F6", isSubscribed: true },
    { name: "Indigo",  value: "#6366F1", isSubscribed: true },
    { name: "Purple",  value: "#8B5CF6", isSubscribed: true },
    { name: "Red",     value: "#EF4444", isSubscribed: true },
    { name: "Orange",  value: "#F97316", isSubscribed: true },
    { name: "Teal",    value: "#14B8A6", isSubscribed: true },
    { name: "Pink",    value: "#EC4899", isSubscribed: true },
    { name: "Gray",    value: "#6B7280", isSubscribed: true },
];

export default function ColorPicker({ selectedColor, onChange }: ColorPickerProps) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
    const buttonRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const { data } = useUser();
    const isSubscribed = data?.user?.isSubscribed ?? false;

    function updatePosition() {
        if (!buttonRef.current) return;
        const rect = buttonRef.current.getBoundingClientRect();
        const dropdownWidth = 288; // w-72
        const viewportWidth = window.innerWidth;

        const rightAligned = rect.right - dropdownWidth;
        const left = Math.max(8, Math.min(rightAligned, viewportWidth - dropdownWidth - 8));

        setDropdownStyle({
            position: "fixed",
            top: rect.bottom + 8,
            left,
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

    function handleSelect(color: ColorItem) {
        if (color.isSubscribed && !isSubscribed) return;
        onChange(color.value);
        setIsOpen(false);
    }

    const dropdown = isOpen ? (
        <div
            ref={dropdownRef}
            style={dropdownStyle}
            className="rounded-xl border bg-background shadow-xl p-3"
        >
            <div className="grid grid-cols-4 gap-3 mb-1">
                {colors.map((color) => {
                    const locked = color.isSubscribed && !isSubscribed;
                    return (
                        <button
                            key={color.value}
                            type="button"
                            onClick={() => handleSelect(color)}
                            className={`relative flex flex-col items-center gap-1 transition ${
                                locked ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
                            }`}
                        >
                            <div
                                className={`w-12 h-12 rounded-full border-2 transition-all flex items-center justify-center ${
                                    selectedColor === color.value
                                        ? "border-black scale-105"
                                        : "border-transparent hover:border-gray-400"
                                }`}
                                style={{ backgroundColor: color.value }}
                            >
                                {selectedColor === color.value && (
                                    <Check className="size-4 text-white" />
                                )}
                                {locked && (
                                    <Crown className="absolute -top-1 -right-1 size-4 text-amber-500 bg-white rounded-full p-[2px]" />
                                )}
                            </div>
                            <span className="text-[11px] text-muted-foreground">
                                {color.name}
                            </span>
                        </button>
                    );
                })}
            </div>

            {!isSubscribed && (
                <div className="mt-3 rounded-lg bg-purple-50 border border-purple-200 p-3">
                    <p className="text-xs text-purple-700 font-medium">
                        Unlock premium accent colors
                    </p>
                    <button
                        type="button"
                        onClick={() => router.push("/subscriptions")}
                        className="mt-2 w-full bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg px-3 py-2 transition"
                    >
                        Buy Pro Subscription
                    </button>
                </div>
            )}
        </div>
    ) : null;

    return (
        <div className="relative">
            <button
                ref={buttonRef}
                type="button"
                onClick={() => setIsOpen((open) => !open)}
                className="flex items-center gap-1 text-sm text-purple-600 bg-gradient-to-br from-purple-50 to-purple-100 ring-1 ring-purple-300 hover:ring-purple-400 transition-all px-3 py-2 rounded-lg"
            >
                <Palette size={16} />
                <span className="max-sm:hidden">Accent</span>
            </button>

            {typeof document !== "undefined" && createPortal(dropdown, document.body)}
        </div>
    );
}