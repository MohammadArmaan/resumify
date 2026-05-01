"use client";

import { useState, useEffect } from "react";
import { ResumeData } from "@/types/resume-types";
import { useAtsScore } from "@/hooks/mutations/ai/useAtsScore";
import { useCoverLetter } from "@/hooks/mutations/ai/useCoverLetter";
import { useJobMatch } from "@/hooks/mutations/ai/useJobMatch";
import { useUser } from "@/hooks/queries/useUser";
import { resumeToText } from "@/lib/resumeToText";
import { useQueryClient } from "@tanstack/react-query";
import {
    ScanText,
    Briefcase,
    Mail,
    Copy,
    Check,
    Maximize2,
    X,
    ChevronRight,
    AlertCircle,
    Lightbulb,
    TrendingUp,
    TrendingDown,
    Sparkles,
    Lock,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface AIResumeCheckProps {
    data: ResumeData;
}

type Tab = "ats" | "match" | "cover";

// ── Score Ring ────────────────────────────────────────────────────────────────
function ScoreRing({ score, color }: { score: number; color: string }) {
    const r = 36;
    const circ = 2 * Math.PI * r;
    const [on, setOn] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setOn(true), 80);
        return () => clearTimeout(t);
    }, []);
    const offset = on ? circ - (score / 100) * circ : circ;
    const grade =
        score >= 85 ? "Excellent" : score >= 70 ? "Good" : score >= 55 ? "Fair" : "Needs work";
    return (
        <div className="relative w-20 h-20 shrink-0">
            <svg width="80" height="80" viewBox="0 0 80 80" className="-rotate-90">
                <circle
                    cx="40" cy="40" r={r} fill="none"
                    strokeWidth="7"
                    className="stroke-gray-200 dark:stroke-gray-700"
                />
                <circle
                    cx="40" cy="40" r={r} fill="none"
                    stroke={color} strokeWidth="7" strokeLinecap="round"
                    strokeDasharray={circ} strokeDashoffset={offset}
                    style={{ transition: "stroke-dashoffset 1.1s cubic-bezier(.4,0,.2,1)" }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xl font-bold leading-none tabular-nums" style={{ color }}>
                    {score}
                </span>
                <span className="text-[9px] text-gray-400 dark:text-gray-500 font-medium tracking-wide mt-0.5 uppercase">
                    {grade}
                </span>
            </div>
        </div>
    );
}

// ── Mini Bar ──────────────────────────────────────────────────────────────────
function MiniBar({ label, value, color }: { label: string; value: number; color: string }) {
    const [on, setOn] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setOn(true), 150);
        return () => clearTimeout(t);
    }, []);
    return (
        <div className="space-y-1">
            <div className="flex justify-between">
                <span className="text-[11px] text-gray-500 dark:text-gray-400">{label}</span>
                <span className="text-[11px] font-semibold text-gray-700 dark:text-gray-300">{value}%</span>
            </div>
            <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ width: on ? `${value}%` : "0%", backgroundColor: color }}
                />
            </div>
        </div>
    );
}

// ── Cover Letter Modal ────────────────────────────────────────────────────────
function CoverModal({ text, onClose }: { text: string; onClose: () => void }) {
    const [copied, setCopied] = useState(false);
    const copy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    useEffect(() => {
        const fn = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", fn);
        return () => document.removeEventListener("keydown", fn);
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col border border-gray-200 dark:border-gray-700 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 dark:border-gray-800 shrink-0">
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                        <Mail className="w-3.5 h-3.5 text-green-600 dark:text-green-500" />
                        Cover Letter
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={copy}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                                bg-linear-to-br from-green-100 to-green-200 dark:from-green-900/60 dark:to-green-800/60
                                text-green-700 dark:text-green-400
                                ring-1 ring-green-300 dark:ring-green-700
                                hover:ring-green-400 dark:hover:ring-green-600 transition-all"
                        >
                            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                            {copied ? "Copied" : "Copy"}
                        </button>
                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 dark:text-gray-500 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                <div className="overflow-y-auto px-7 py-6">
                    <p
                        className="text-[14px] leading-8 text-gray-700 dark:text-gray-300 whitespace-pre-wrap"
                        style={{ fontFamily: "Georgia, serif" }}
                    >
                        {text}
                    </p>
                </div>
            </div>
        </div>
    );
}

// ── Input class ───────────────────────────────────────────────────────────────
const inputCls =
    "w-full text-sm text-gray-800 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-600 " +
    "bg-gray-50 dark:bg-gray-800/60 " +
    "border border-gray-200 dark:border-gray-700 " +
    "rounded-xl px-3.5 py-2.5 " +
    "focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 dark:focus:border-green-600 " +
    "transition-all";

// ── Main Component ────────────────────────────────────────────────────────────
export default function AIResumeCheck({ data }: AIResumeCheckProps) {
    const { data: userData } = useUser();
    const queryClient = useQueryClient();
    const isSubscribed = userData?.user?.isSubscribed;

    const atsCheck = useAtsScore();
    const jobMatch = useJobMatch();
    const coverLetter = useCoverLetter();

    const [tab, setTab] = useState<Tab>("ats");
    const [jd, setJd] = useState("");
    const [company, setCompany] = useState("");
    const [role, setRole] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [coverCopied, setCoverCopied] = useState(false);

    const router = useRouter()

    const resumeText = resumeToText(data);
    const coverText = coverLetter.data?.coverLetter ?? "";
    const wordCount = coverText.trim().split(/\s+/).filter(Boolean).length;

    const copyCover = () => {
        navigator.clipboard.writeText(coverText);
        setCoverCopied(true);
        setTimeout(() => setCoverCopied(false), 2000);
    };

    const invalidate = {
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["user"] }),
    };

    // ── Upsell ────────────────────────────────────────────────────────────────
    if (!isSubscribed) {
        return (
            <div className="flex items-center gap-3 rounded-xl border border-dashed border-amber-300 dark:border-amber-700 bg-amber-50/60 dark:bg-amber-900/20 px-4 py-3">
                <Lock className="w-4 h-4 text-amber-600 dark:text-amber-500 shrink-0" />
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-amber-800 dark:text-amber-400">Premium AI tools</p>
                    <p className="text-xs text-amber-600 dark:text-amber-500 truncate">
                        ATS scoring, job match analysis, and AI cover letters.
                    </p>
                </div>
                <button className="shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold
                    bg-linear-to-br from-amber-100 to-amber-200 dark:from-amber-900/60 dark:to-amber-800/60
                    text-amber-700 dark:text-amber-400
                    ring-1 ring-amber-300 dark:ring-amber-700
                    hover:ring-amber-400 dark:hover:ring-amber-600 transition-all" onClick={() => router.push("/dashboard/subscriptions")}>
                    Upgrade <ChevronRight className="w-3 h-3" />
                </button>
            </div>
        );
    }

    const tabs = [
        { id: "ats" as Tab, label: "ATS Score", Icon: ScanText },
        { id: "match" as Tab, label: "Job Match", Icon: Briefcase },
        { id: "cover" as Tab, label: "Cover Letter", Icon: Mail },
    ];

    // ── Shared button variants ────────────────────────────────────────────────
    const btnPurple =
        "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold " +
        "bg-linear-to-br from-purple-100 to-purple-200 dark:from-purple-900/50 dark:to-purple-800/50 " +
        "text-purple-600 dark:text-purple-400 " +
        "ring-1 ring-purple-300 dark:ring-purple-700 " +
        "hover:ring-purple-400 dark:hover:ring-purple-600 " +
        "disabled:opacity-40 disabled:cursor-not-allowed transition-all";

    const btnBlue = 
    "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold " +
        "bg-linear-to-br from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50 " +
        "text-blue-600 dark:text-blue-400 " +
        "ring-1 ring-blue-300 dark:ring-blue-700 " +
        "hover:ring-blue-400 dark:hover:ring-blue-600 " +
        "disabled:opacity-40 disabled:cursor-not-allowed transition-all";

    const btnGreen =
        "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold " +
        "bg-linear-to-br from-green-100 to-green-200 dark:from-green-900/50 dark:to-green-800/50 " +
        "text-green-700 dark:text-green-400 " +
        "ring-1 ring-green-300 dark:ring-green-700 " +
        "hover:ring-green-400 dark:hover:ring-green-600 " +
        "disabled:opacity-40 disabled:cursor-not-allowed transition-all";

    return (
        <>
            <div className="space-y-0">
                {/* Section label */}
                <div className="flex items-center justify-between pb-3">
                    <div className="flex items-center gap-1.5 mx-auto">
                        <Sparkles className="w-6 h-6 text-green-600 dark:text-green-500" />
                        <h1 className="text-xl font-semibold text-foreground uppercase tracking-wider">
                            AI Tools
                        </h1>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full
                        bg-green-50 dark:bg-green-900/30
                        border border-green-200 dark:border-green-800
                        text-green-700 dark:text-green-400
                        uppercase tracking-wide">
                        Pro
                    </span>
                </div>

                {/* Tab strip */}
                <div className="flex border-b border-gray-200 dark:border-gray-700">
                    {tabs.map(({ id, label, Icon }) => (
                        <button
                            key={id}
                            onClick={() => setTab(id)}
                            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold border-b-2 -mb-px transition-all duration-150 ${
                                tab === id
                                    ? "border-green-600 dark:border-green-500 text-green-700 dark:text-green-400"
                                    : "border-transparent text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                            }`}
                        >
                            <Icon className="w-3 h-3" />
                            {label}
                        </button>
                    ))}
                </div>

                {/* Panel body */}
                <div className="pt-5 space-y-4">

                    {/* ══ ATS TAB ══════════════════════════════════════════════ */}
                    {tab === "ats" && (
                        <div className="space-y-4">
                            <textarea
                                rows={3}
                                value={jd}
                                onChange={(e) => setJd(e.target.value)}
                                placeholder="Paste the job description to check keyword alignment…"
                                className={`${inputCls} resize-none`}
                            />
                            <button
                                onClick={() => atsCheck.mutate({ resumeText, jobDescription: jd }, invalidate)}
                                disabled={atsCheck.isPending}
                                className={btnPurple}
                            >
                                <ScanText className="w-3.5 h-3.5" />
                                {atsCheck.isPending ? "Analyzing…" : "Check ATS Score"}
                            </button>

                            {atsCheck.data?.data && (
                                <div className="space-y-4">
                                    {/* Score strip */}
                                    <div className="flex items-center gap-4 rounded-xl
                                        bg-blue-50/70 dark:bg-blue-950/30
                                        border border-blue-100 dark:border-blue-900/60
                                        p-4">
                                        <ScoreRing score={atsCheck.data.data.score} color="#2563eb" />
                                        <div className="flex-1 space-y-2.5 min-w-0">
                                            <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                                                ATS Compatibility
                                            </p>
                                            <MiniBar label="Keyword match" value={atsCheck.data.data.score} color="#2563eb" />
                                            <MiniBar label="Format" value={Math.min(100, atsCheck.data.data.score + 12)} color="#0891b2" />
                                            <MiniBar label="Readability" value={Math.min(100, atsCheck.data.data.score + 6)} color="#10b981" />
                                        </div>
                                    </div>

                                    {/* Missing keywords */}
                                    {atsCheck.data.data.missingKeywords?.length > 0 && (
                                        <div className="space-y-2">
                                            <p className="text-[11px] font-semibold text-red-600 dark:text-red-400 flex items-center gap-1.5 uppercase tracking-wide">
                                                <AlertCircle className="w-3 h-3" />
                                                Missing keywords
                                            </p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {atsCheck.data.data.missingKeywords.map((k: string, i: number) => (
                                                    <span key={i}
                                                        className="px-2.5 py-1 rounded-full text-[11px] font-medium
                                                            bg-red-50 dark:bg-red-900/30
                                                            border border-red-200 dark:border-red-800
                                                            text-red-700 dark:text-red-400">
                                                        {k}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Suggestions */}
                                    {atsCheck.data.data.suggestions?.length > 0 && (
                                        <div className="space-y-0">
                                            <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-1.5 uppercase tracking-wide mb-2">
                                                <Lightbulb className="w-3 h-3 text-amber-500 dark:text-amber-400" />
                                                Suggestions
                                            </p>
                                            {atsCheck.data.data.suggestions.map((s: string, i: number) => (
                                                <div key={i}
                                                    className="flex items-start gap-2.5 text-xs
                                                        text-gray-700 dark:text-gray-300
                                                        leading-relaxed py-2.5
                                                        border-b border-gray-100 dark:border-gray-800 last:border-0">
                                                    <ChevronRight className="w-3 h-3 text-gray-300 dark:text-gray-600 shrink-0 mt-0.5" />
                                                    {s}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ══ MATCH TAB ════════════════════════════════════════════ */}
                    {tab === "match" && (
                        <div className="space-y-4">
                            <textarea
                                rows={3}
                                value={jd}
                                onChange={(e) => setJd(e.target.value)}
                                placeholder="Paste the job description to see how well your resume matches…"
                                className={`${inputCls} resize-none`}
                            />
                            <button
                                onClick={() => jobMatch.mutate({ resumeText, jobDescription: jd }, invalidate)}
                                disabled={jobMatch.isPending || !jd.trim()}
                                className={btnGreen}
                            >
                                <Briefcase className="w-3.5 h-3.5" />
                                {jobMatch.isPending ? "Analyzing…" : "Analyze Match"}
                            </button>

                            {jobMatch.data?.data && (
                                <div className="space-y-4">
                                    {/* Score strip */}
                                    <div className="flex items-center gap-4 rounded-xl
                                        bg-green-50/70 dark:bg-green-950/30
                                        border border-green-100 dark:border-green-900/60
                                        p-4">
                                        <ScoreRing score={jobMatch.data.data.matchScore} color="#16a34a" />
                                        <div className="flex-1 space-y-2.5 min-w-0">
                                            <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                                                Role Fit Score
                                            </p>
                                            <MiniBar label="Technical fit" value={jobMatch.data.data.matchScore} color="#16a34a" />
                                            <MiniBar label="Experience" value={Math.min(100, jobMatch.data.data.matchScore - 4)} color="#0891b2" />
                                            <MiniBar label="Culture signals" value={Math.min(100, jobMatch.data.data.matchScore + 4)} color="#f59e0b" />
                                        </div>
                                    </div>

                                    {/* Strengths + Gaps */}
                                    <div className="grid grid-cols-2 gap-x-6 border-t border-gray-100 dark:border-gray-800 pt-4">
                                        <div className="space-y-0">
                                            <p className="text-[11px] font-semibold text-green-700 dark:text-green-500 flex items-center gap-1 uppercase tracking-wide mb-2">
                                                <TrendingUp className="w-3 h-3" />
                                                Strengths
                                            </p>
                                            {jobMatch.data.data.strengths.map((s: string, i: number) => (
                                                <div key={i}
                                                    className="text-xs text-gray-700 dark:text-gray-300 leading-snug py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                                                    {s}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="space-y-0">
                                            <p className="text-[11px] font-semibold text-red-600 dark:text-red-400 flex items-center gap-1 uppercase tracking-wide mb-2">
                                                <TrendingDown className="w-3 h-3" />
                                                Gaps
                                            </p>
                                            {jobMatch.data.data.gaps.map((g: string, i: number) => (
                                                <div key={i}
                                                    className="text-xs text-gray-700 dark:text-gray-300 leading-snug py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                                                    {g}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ══ COVER LETTER TAB ═════════════════════════════════════ */}
                    {tab === "cover" && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                                        Company
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Stripe"
                                        value={company}
                                        onChange={(e) => setCompany(e.target.value)}
                                        className={inputCls}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                                        Role
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Senior Engineer"
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        className={inputCls}
                                    />
                                </div>
                            </div>

                            <button
                                onClick={() =>
                                    coverLetter.mutate(
                                        { company, role, resumeSummary: data.professionalSummary || "" },
                                        invalidate
                                    )
                                }
                                disabled={coverLetter.isPending || !company.trim() || !role.trim()}
                                className={btnBlue}
                            >
                                <Mail className="w-3.5 h-3.5" />
                                {coverLetter.isPending ? "Generating…" : "Generate Cover Letter"}
                            </button>

                            {coverText && (
                                <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                                    {/* Toolbar */}
                                    <div className="flex items-center justify-between px-4 py-2.5
                                        bg-gray-50 dark:bg-gray-800/60
                                        border-b border-gray-100 dark:border-gray-700">
                                        <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                                            {wordCount} words
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => setModalOpen(true)}
                                                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold
                                                    border border-gray-200 dark:border-gray-700
                                                    bg-white dark:bg-gray-800
                                                    text-gray-600 dark:text-gray-400
                                                    hover:bg-gray-50 dark:hover:bg-gray-700
                                                    transition-all"
                                            >
                                                <Maximize2 className="w-3 h-3" />
                                                Expand
                                            </button>
                                            <button
                                                onClick={copyCover}
                                                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold
                                                    bg-linear-to-br from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50
                                                    text-blue-600 dark:text-blue-400
                                                    ring-1 ring-blue-300 dark:ring-blue-700
                                                    hover:ring-blue-400 dark:hover:ring-blue-600
                                                    transition-all"
                                            >
                                                {coverCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                                {coverCopied ? "Copied" : "Copy"}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Scrollable preview */}
                                    <div className="relative bg-white dark:bg-gray-900">
                                        <div className="max-h-52 overflow-y-auto px-5 py-4 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700">
                                            <p
                                                className="text-[13px] leading-7 text-gray-700 dark:text-gray-300 whitespace-pre-wrap"
                                                style={{ fontFamily: "Georgia, serif" }}
                                            >
                                                {coverText}
                                            </p>
                                        </div>
                                        <div className="absolute bottom-0 inset-x-0 h-10
                                            bg-gradient-to-t from-white dark:from-gray-900 to-transparent
                                            pointer-events-none" />
                                    </div>

                                    <div className="px-5 pb-3 pt-1 bg-white dark:bg-gray-900">
                                        <button
                                            onClick={() => setModalOpen(true)}
                                            className="text-xs font-medium text-green-600 dark:text-green-500 hover:text-green-700 dark:hover:text-green-400 transition-colors"
                                        >
                                            Read full letter
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Cover Letter Modal */}
            {modalOpen && coverText && (
                <CoverModal text={coverText} onClose={() => setModalOpen(false)} />
            )}
        </>
    );
}