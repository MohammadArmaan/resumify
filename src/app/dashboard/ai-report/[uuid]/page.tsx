"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";

import { useAtsScore } from "@/hooks/mutations/ai/useAtsScore";
import { useJobMatch } from "@/hooks/mutations/ai/useJobMatch";
import { useCoverLetter } from "@/hooks/mutations/ai/useCoverLetter";

import { useAiReport } from "@/hooks/queries/ai-report/useAiReport";
import { useCreateAiReport } from "@/hooks/queries/ai-report/useCreateAiReport";
import { useUpdateAiReport } from "@/hooks/queries/ai-report/useUpdateAiReport";
import { LoadingScreen } from "@/components/LoadingScreen";

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
    ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/queries/useUser";
import Link from "next/link";

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
        score >= 85
            ? "Excellent"
            : score >= 70
              ? "Good"
              : score >= 55
                ? "Fair"
                : "Needs work";
    return (
        <div className="relative w-20 h-20 shrink-0">
            <svg
                width="80"
                height="80"
                viewBox="0 0 80 80"
                className="-rotate-90"
            >
                <circle
                    cx="40"
                    cy="40"
                    r={r}
                    fill="none"
                    strokeWidth="7"
                    className="stroke-muted"
                />
                <circle
                    cx="40"
                    cy="40"
                    r={r}
                    fill="none"
                    stroke={color}
                    strokeWidth="7"
                    strokeLinecap="round"
                    strokeDasharray={circ}
                    strokeDashoffset={offset}
                    style={{
                        transition:
                            "stroke-dashoffset 1.1s cubic-bezier(.4,0,.2,1)",
                    }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span
                    className="text-xl font-bold leading-none tabular-nums"
                    style={{ color }}
                >
                    {score}
                </span>
                <span className="text-[9px] text-muted-foreground font-medium tracking-wide mt-0.5 uppercase">
                    {grade}
                </span>
            </div>
        </div>
    );
}

// ── Mini Bar ──────────────────────────────────────────────────────────────────
function MiniBar({
    label,
    value,
    color,
}: {
    label: string;
    value: number;
    color: string;
}) {
    const [on, setOn] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setOn(true), 150);
        return () => clearTimeout(t);
    }, []);
    return (
        <div className="space-y-1">
            <div className="flex justify-between">
                <span className="text-[11px] text-muted-foreground">
                    {label}
                </span>
                <span className="text-[11px] font-semibold text-foreground">
                    {value}%
                </span>
            </div>
            <div className="h-1 bg-muted rounded-full overflow-hidden">
                <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{
                        width: on ? `${value}%` : "0%",
                        backgroundColor: color,
                    }}
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
                className="bg-background rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col border border-border shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-5 py-3 border-b border-border shrink-0">
                    <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                        <Mail className="w-3.5 h-3.5 text-green-600 dark:text-green-500" />
                        Cover Letter
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={copy}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                                bg-green-50 dark:bg-green-900/40 text-green-700 dark:text-green-400
                                ring-1 ring-green-300 dark:ring-green-700
                                hover:ring-green-400 dark:hover:ring-green-600 transition-all"
                        >
                            {copied ? (
                                <Check className="w-3 h-3" />
                            ) : (
                                <Copy className="w-3 h-3" />
                            )}
                            {copied ? "Copied" : "Copy"}
                        </button>
                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                <div className="overflow-y-auto px-7 py-6">
                    <p
                        className="text-[14px] leading-8 text-foreground whitespace-pre-wrap"
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
    "w-full text-sm text-foreground placeholder:text-muted-foreground " +
    "bg-muted/50 border border-border rounded-xl px-3.5 py-2.5 " +
    "focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 " +
    "transition-all resize-none";

// ── Shared button variants ────────────────────────────────────────────────────
const btnPurple =
    "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold " +
    "bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 " +
    "ring-1 ring-purple-300 dark:ring-purple-700 " +
    "hover:ring-purple-400 dark:hover:ring-purple-600 " +
    "disabled:opacity-40 disabled:cursor-not-allowed transition-all";

const btnBlue =
    "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold " +
    "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 " +
    "ring-1 ring-blue-300 dark:ring-blue-700 " +
    "hover:ring-blue-400 dark:hover:ring-blue-600 " +
    "disabled:opacity-40 disabled:cursor-not-allowed transition-all";

const btnGreen =
    "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold " +
    "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 " +
    "ring-1 ring-green-300 dark:ring-green-700 " +
    "hover:ring-green-400 dark:hover:ring-green-600 " +
    "disabled:opacity-40 disabled:cursor-not-allowed transition-all";

// ── Tabs ──────────────────────────────────────────────────────────────────────
type Tab = "ats" | "match" | "cover";

const tabs: { id: Tab; label: string; Icon: React.ElementType }[] = [
    { id: "ats", label: "ATS Score", Icon: ScanText },
    { id: "match", label: "Job Match", Icon: Briefcase },
    { id: "cover", label: "Cover Letter", Icon: Mail },
];

// ── Mobile Resume PDF ─────────────────────────────────────────────────────────
function MobileResumePDF({ url }: { url: string }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);

    const IFRAME_W = 794;
    const IFRAME_H = 1123;

    useEffect(() => {
        function recalc() {
            if (containerRef.current) {
                const available = containerRef.current.offsetWidth;
                setScale(available / IFRAME_W);
            }
        }
        recalc();
        window.addEventListener("resize", recalc);
        return () => window.removeEventListener("resize", recalc);
    }, []);

    const scaledH = IFRAME_H * scale;

    return (
        <div
            ref={containerRef}
            className="w-full overflow-hidden rounded-xl border border-border shadow-sm"
            style={{ height: scaledH }}
        >
            <iframe
                src={`${url}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                title="Resume Preview"
                style={{
                    width: IFRAME_W,
                    height: IFRAME_H,
                    transformOrigin: "top left",
                    transform: `scale(${scale})`,
                    pointerEvents: "none",
                    border: "none",
                }}
            />
        </div>
    );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AiReportPage() {
    const { uuid } = useParams<{ uuid: string }>();
    const router = useRouter();

    const { data: userData } = useUser();
    const isSubscribed = userData?.user?.isSubscribed;

    const { data: reportData, isLoading } = useAiReport(uuid);
    const report = reportData?.report;
    const resumeText = report?.resumeSnapshot ?? "";

    const atsScore = useAtsScore();
    const jobMatch = useJobMatch();
    const coverLetter = useCoverLetter();

    const createReport = useCreateAiReport();
    const updateReport = useUpdateAiReport();

    const [jd, setJd] = useState("");
    const [company, setCompany] = useState("");
    const [role, setRole] = useState("");
    const [tab, setTab] = useState<Tab>("ats");
    const [modalOpen, setModalOpen] = useState(false);
    const [coverCopied, setCoverCopied] = useState(false);

    useEffect(() => {
        if (report?.jobDescription) setJd(report.jobDescription);
    }, [report]);

    const persist = useCallback(
        (type: "ATS" | "JOB_MATCH" | "COVER_LETTER", result: any) => {
            if (!resumeText) return;
            if (uuid) {
                updateReport.mutate({
                    uuid,
                    jobDescription: jd,
                    company,
                    role,
                    result,
                });
            } else {
                createReport.mutate({
                    title: `${type} Analysis`,
                    type,
                    jobDescription: jd,
                    company,
                    role,
                    resumeSnapshot: resumeText,
                    result,
                });
            }
        },
        [uuid, jd, company, role, resumeText, updateReport, createReport],
    );

    function handleAts() {
        if (!resumeText || !jd) return;
        atsScore.mutate(
            { resumeText, jobDescription: jd },
            { onSuccess: (res) => persist("ATS", res.data) },
        );
    }

    function handleMatch() {
        if (!resumeText || !jd) return;
        jobMatch.mutate(
            { resumeText, jobDescription: jd },
            { onSuccess: (res) => persist("JOB_MATCH", res.data) },
        );
    }

    function handleCover() {
        if (!resumeText || !company || !role) return;
        coverLetter.mutate(
            { company, role, resumeSummary: resumeText },
            {
                onSuccess: (res) =>
                    persist("COVER_LETTER", { coverLetter: res.coverLetter }),
            },
        );
    }

    const coverText = coverLetter.data?.coverLetter ?? "";
    const wordCount = coverText.trim().split(/\s+/).filter(Boolean).length;

    const copyCover = () => {
        navigator.clipboard.writeText(coverText);
        setCoverCopied(true);
        setTimeout(() => setCoverCopied(false), 2000);
    };

    if (!isSubscribed) {
        return (
            <div className="flex items-center gap-3 rounded-xl border border-dashed border-amber-300 dark:border-amber-700 bg-amber-50/60 dark:bg-amber-900/20 px-4 py-3">
                <Lock className="w-4 h-4 text-amber-600 dark:text-amber-500 shrink-0" />
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-amber-800 dark:text-amber-400">
                        Premium AI tools
                    </p>
                    <p className="text-xs text-amber-600 dark:text-amber-500 truncate">
                        ATS scoring, job match analysis, and AI cover letters.
                    </p>
                </div>
                <button
                    className="shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold
                    bg-linear-to-br from-amber-100 to-amber-200 dark:from-amber-900/60 dark:to-amber-800/60
                    text-amber-700 dark:text-amber-400
                    ring-1 ring-amber-300 dark:ring-amber-700
                    hover:ring-amber-400 dark:hover:ring-amber-600 transition-all"
                    onClick={() => router.push("/dashboard/subscriptions")}
                >
                    Upgrade <ChevronRight className="w-3 h-3" />
                </button>
            </div>
        );
    }

    if (isLoading) return <LoadingScreen />;

    return (
        <>
            {/*
             * Layout strategy:
             * - Mobile: single column, AI tools stacked above resume preview
             * - Desktop (lg+): true side-by-side row inside a full-viewport container.
             *   The outer wrapper is h-screen with overflow-hidden so neither column
             *   can push the page taller than the viewport. The left AI panel scrolls
             *   independently; the right PDF panel also scrolls independently.
             *   Both panels use h-full so they stretch to the container height.
             */}
            <div className="w-full">
                {/* Outer container: full viewport height on desktop, natural height on mobile */}
                <div className="flex items-center justify-between">
                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 p-1.5 text-muted-foreground hover:text-muted-foreground/70 hover:bg-accent rounded-lg"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Dashboard
                </Link>
            </div>
            
                <div
                    className="
                        flex flex-col gap-4
                        p-4
                        bg-background
                        lg:flex-row
                        lg:gap-6
                        lg:h-screen
                        lg:overflow-hidden
                        lg:p-4
                    "
                >
                    {/* ── LEFT PANEL — AI Tools ─────────────────────────────── */}
                    {/*
                     * On desktop this panel has a fixed width, takes the full
                     * container height, and scrolls internally — acting like a
                     * sticky sidebar that never moves while the PDF scrolls.
                     */}
                    <div
                        className="
                            w-full shrink-0
                            rounded-lg shadow-md border border-border
                            p-4 sm:p-5 space-y-5
                            overflow-y-auto
                            lg:w-[420px] lg:min-w-[380px] lg:h-full
                        "
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between pb-1">
                            <div className="flex items-center gap-1.5">
                                <Sparkles className="w-5 h-5 text-green-600 dark:text-green-500" />
                                <h1 className="text-lg font-semibold text-foreground uppercase tracking-wider">
                                    AI Tools
                                </h1>
                            </div>
                            <span
                                className="text-[10px] font-semibold px-2 py-0.5 rounded-full
                            bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800
                            text-green-700 dark:text-green-400 uppercase tracking-wide"
                            >
                                Pro
                            </span>
                        </div>

                        {/* Tab strip */}
                        <div className="flex border-b border-border">
                            {tabs.map(({ id, label, Icon }) => (
                                <button
                                    key={id}
                                    onClick={() => setTab(id)}
                                    className={`flex items-center gap-1.5 px-3 sm:px-4 py-2.5 text-xs font-semibold border-b-2 -mb-px transition-all duration-150 ${
                                        tab === id
                                            ? "border-green-600 dark:border-green-500 text-green-700 dark:text-green-400"
                                            : "border-transparent text-muted-foreground hover:text-foreground"
                                    }`}
                                >
                                    <Icon className="w-3 h-3" />
                                    {label}
                                </button>
                            ))}
                        </div>

                        {/* Panel body */}
                        <div className="space-y-4">
                            {/* ══ ATS TAB ══════════════════════════════════════════ */}
                            {tab === "ats" && (
                                <div className="space-y-4">
                                    <textarea
                                        rows={12}
                                        value={jd}
                                        onChange={(e) => setJd(e.target.value)}
                                        placeholder="Paste the job description to check keyword alignment…"
                                        className={inputCls}
                                    />
                                    <button
                                        onClick={handleAts}
                                        disabled={
                                            atsScore.isPending ||
                                            !resumeText ||
                                            !jd.trim()
                                        }
                                        className={btnPurple}
                                    >
                                        <ScanText className="w-3.5 h-3.5" />
                                        {atsScore.isPending
                                            ? "Analyzing…"
                                            : "Check ATS Score"}
                                    </button>

                                    {atsScore.data?.data && (
                                        <div className="space-y-4">
                                            {/* Score strip */}
                                            <div
                                                className="flex items-center gap-4 rounded-xl
                                            bg-blue-50/70 dark:bg-blue-950/30
                                            border border-blue-100 dark:border-blue-900/60 p-4"
                                            >
                                                <ScoreRing
                                                    score={
                                                        atsScore.data.data.score
                                                    }
                                                    color="#2563eb"
                                                />
                                                <div className="flex-1 space-y-2.5 min-w-0">
                                                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                                                        ATS Compatibility
                                                    </p>
                                                    <MiniBar
                                                        label="Keyword match"
                                                        value={
                                                            atsScore.data.data
                                                                .score
                                                        }
                                                        color="#2563eb"
                                                    />
                                                    <MiniBar
                                                        label="Format"
                                                        value={Math.min(
                                                            100,
                                                            atsScore.data.data
                                                                .score + 12,
                                                        )}
                                                        color="#0891b2"
                                                    />
                                                    <MiniBar
                                                        label="Readability"
                                                        value={Math.min(
                                                            100,
                                                            atsScore.data.data
                                                                .score + 6,
                                                        )}
                                                        color="#10b981"
                                                    />
                                                </div>
                                            </div>

                                            {/* Missing keywords */}
                                            {atsScore.data.data.missingKeywords
                                                ?.length > 0 && (
                                                <div className="space-y-2">
                                                    <p className="text-[11px] font-semibold text-red-600 dark:text-red-400 flex items-center gap-1.5 uppercase tracking-wide">
                                                        <AlertCircle className="w-3 h-3" />
                                                        Missing keywords
                                                    </p>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {atsScore.data.data.missingKeywords.map(
                                                            (
                                                                k: string,
                                                                i: number,
                                                            ) => (
                                                                <span
                                                                    key={i}
                                                                    className="px-2.5 py-1 rounded-full text-[11px] font-medium
                                                                bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800
                                                                text-red-700 dark:text-red-400"
                                                                >
                                                                    {k}
                                                                </span>
                                                            ),
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Suggestions */}
                                            {atsScore.data.data.suggestions
                                                ?.length > 0 && (
                                                <div className="space-y-0">
                                                    <p className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5 uppercase tracking-wide mb-2">
                                                        <Lightbulb className="w-3 h-3 text-amber-500" />
                                                        Suggestions
                                                    </p>
                                                    {atsScore.data.data.suggestions.map(
                                                        (
                                                            s: string,
                                                            i: number,
                                                        ) => (
                                                            <div
                                                                key={i}
                                                                className="flex items-start gap-2.5 text-xs text-foreground leading-relaxed py-2.5
                                                            border-b border-border last:border-0"
                                                            >
                                                                <ChevronRight className="w-3 h-3 text-muted-foreground shrink-0 mt-0.5" />
                                                                {s}
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* ══ MATCH TAB ════════════════════════════════════════ */}
                            {tab === "match" && (
                                <div className="space-y-4">
                                    <textarea
                                        rows={12}
                                        value={jd}
                                        onChange={(e) => setJd(e.target.value)}
                                        placeholder="Paste the job description to see how well your resume matches…"
                                        className={inputCls}
                                    />
                                    <button
                                        onClick={handleMatch}
                                        disabled={
                                            jobMatch.isPending ||
                                            !resumeText ||
                                            !jd.trim()
                                        }
                                        className={btnGreen}
                                    >
                                        <Briefcase className="w-3.5 h-3.5" />
                                        {jobMatch.isPending
                                            ? "Analyzing…"
                                            : "Analyze Match"}
                                    </button>

                                    {jobMatch.data?.data && (
                                        <div className="space-y-4">
                                            {/* Score strip */}
                                            <div
                                                className="flex items-center gap-4 rounded-xl
                                            bg-green-50/70 dark:bg-green-950/30
                                            border border-green-100 dark:border-green-900/60 p-4"
                                            >
                                                <ScoreRing
                                                    score={
                                                        jobMatch.data.data
                                                            .matchScore
                                                    }
                                                    color="#16a34a"
                                                />
                                                <div className="flex-1 space-y-2.5 min-w-0">
                                                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                                                        Role Fit Score
                                                    </p>
                                                    <MiniBar
                                                        label="Technical fit"
                                                        value={
                                                            jobMatch.data.data
                                                                .matchScore
                                                        }
                                                        color="#16a34a"
                                                    />
                                                    <MiniBar
                                                        label="Experience"
                                                        value={Math.min(
                                                            100,
                                                            jobMatch.data.data
                                                                .matchScore - 4,
                                                        )}
                                                        color="#0891b2"
                                                    />
                                                    <MiniBar
                                                        label="Culture signals"
                                                        value={Math.min(
                                                            100,
                                                            jobMatch.data.data
                                                                .matchScore + 4,
                                                        )}
                                                        color="#f59e0b"
                                                    />
                                                </div>
                                            </div>

                                            {/* Strengths + Gaps */}
                                            <div className="grid grid-cols-2 gap-x-4 border-t border-border pt-4">
                                                <div className="space-y-0">
                                                    <p className="text-[11px] font-semibold text-green-700 dark:text-green-500 flex items-center gap-1 uppercase tracking-wide mb-2">
                                                        <TrendingUp className="w-3 h-3" />{" "}
                                                        Strengths
                                                    </p>
                                                    {jobMatch.data.data.strengths?.map(
                                                        (
                                                            s: string,
                                                            i: number,
                                                        ) => (
                                                            <div
                                                                key={i}
                                                                className="text-xs text-foreground leading-snug py-2 border-b border-border last:border-0"
                                                            >
                                                                {s}
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                                <div className="space-y-0">
                                                    <p className="text-[11px] font-semibold text-red-600 dark:text-red-400 flex items-center gap-1 uppercase tracking-wide mb-2">
                                                        <TrendingDown className="w-3 h-3" />{" "}
                                                        Gaps
                                                    </p>
                                                    {jobMatch.data.data.gaps?.map(
                                                        (
                                                            g: string,
                                                            i: number,
                                                        ) => (
                                                            <div
                                                                key={i}
                                                                className="text-xs text-foreground leading-snug py-2 border-b border-border last:border-0"
                                                            >
                                                                {g}
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            </div>

                                            {/* Suggestions */}
                                            {jobMatch.data.data.suggestions && jobMatch.data.data.suggestions
                                                ?.length > 0 && (
                                                <div className="space-y-0 border-t border-border pt-4">
                                                    <p className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5 uppercase tracking-wide mb-2">
                                                        <Lightbulb className="w-3 h-3 text-amber-500" />
                                                        Suggestions
                                                    </p>
                                                    {jobMatch.data.data.suggestions && jobMatch.data.data.suggestions.map(
                                                        (
                                                            s: string,
                                                            i: number,
                                                        ) => (
                                                            <div
                                                                key={i}
                                                                className="flex items-start gap-2.5 text-xs text-foreground leading-relaxed py-2.5
                                                            border-b border-border last:border-0"
                                                            >
                                                                <ChevronRight className="w-3 h-3 text-muted-foreground shrink-0 mt-0.5" />
                                                                {s}
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* ══ COVER LETTER TAB ════════════════════════════════ */}
                            {tab === "cover" && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                                                Company
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="e.g. Stripe"
                                                value={company}
                                                onChange={(e) =>
                                                    setCompany(e.target.value)
                                                }
                                                className={inputCls}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                                                Role
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="e.g. Senior Engineer"
                                                value={role}
                                                onChange={(e) =>
                                                    setRole(e.target.value)
                                                }
                                                className={inputCls}
                                            />
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleCover}
                                        disabled={
                                            coverLetter.isPending ||
                                            !company.trim() ||
                                            !role.trim()
                                        }
                                        className={btnBlue}
                                    >
                                        <Mail className="w-3.5 h-3.5" />
                                        {coverLetter.isPending
                                            ? "Generating…"
                                            : "Generate Cover Letter"}
                                    </button>

                                    {coverText && (
                                        <div className="border border-border rounded-xl overflow-hidden">
                                            {/* Toolbar */}
                                            <div className="flex items-center justify-between px-4 py-2.5 bg-muted/50 border-b border-border">
                                                <span className="text-xs text-muted-foreground font-medium">
                                                    {wordCount} words
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() =>
                                                            setModalOpen(true)
                                                        }
                                                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold
                                                        border border-border bg-background text-muted-foreground
                                                        hover:bg-muted transition-all"
                                                    >
                                                        <Maximize2 className="w-3 h-3" />
                                                        Expand
                                                    </button>
                                                    <button
                                                        onClick={copyCover}
                                                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold
                                                        bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400
                                                        ring-1 ring-purple-300 dark:ring-purple-700
                                                        hover:ring-purple-400 dark:hover:ring-purple-600 transition-all"
                                                    >
                                                        {coverCopied ? (
                                                            <Check className="w-3 h-3" />
                                                        ) : (
                                                            <Copy className="w-3 h-3" />
                                                        )}
                                                        {coverCopied
                                                            ? "Copied"
                                                            : "Copy"}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Preview */}
                                            <div className="relative bg-background">
                                                <div className="max-h-52 overflow-y-auto px-5 py-4">
                                                    <p
                                                        className="text-[13px] leading-7 text-foreground whitespace-pre-wrap"
                                                        style={{
                                                            fontFamily:
                                                                "Georgia, serif",
                                                        }}
                                                    >
                                                        {coverText}
                                                    </p>
                                                </div>
                                                <div
                                                    className="absolute bottom-0 inset-x-0 h-10
                                                bg-gradient-to-t from-background to-transparent pointer-events-none"
                                                />
                                            </div>

                                            <div className="px-5 pb-3 pt-1 bg-background">
                                                <button
                                                    onClick={() =>
                                                        setModalOpen(true)
                                                    }
                                                    className="text-xs font-medium text-green-600 dark:text-green-500 hover:text-green-700 transition-colors"
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

                    {/* ── RIGHT PANEL — Resume Preview ──────────────────────────
                     *  flex-1 so it takes all remaining horizontal space.
                     *  On desktop: h-full + overflow-y-auto lets the PDF scroll
                     *  independently while the left panel stays fixed in place.
                     *  On mobile: natural height, no overflow clipping.
                     */}
                    <div
                        className="
                            flex-1 min-w-0
                            bg-background border border-border rounded-xl
                            p-4 sm:p-6 shadow-sm
                            overflow-y-auto
                            min-h-[80vh]
                            lg:h-full lg:min-h-0
                        "
                    >
                        {report?.pdfUrl ? (
                            <>
                                {/* Desktop: full-height iframe, no chrome */}
                                <div className="hidden lg:block h-full rounded-xl overflow-hidden border border-border shadow-sm">
                                    <iframe
                                        src={`${report.pdfUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                                        className="w-full h-full"
                                        title="Resume Preview"
                                        style={{ border: "none" }}
                                    />
                                </div>

                                {/* Mobile: scaled-down page thumbnail */}
                                <div className="lg:hidden">
                                    <MobileResumePDF url={report.pdfUrl} />
                                </div>
                            </>
                        ) : (
                            /* Fallback: plain text */
                            <div className="h-full bg-muted/30 border border-border rounded-xl p-6 overflow-auto">
                                <pre className="text-sm whitespace-pre-wrap text-foreground font-mono leading-relaxed">
                                    {resumeText ||
                                        "No resume content available."}
                                </pre>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Cover Letter Modal */}
            {modalOpen && coverText && (
                <CoverModal
                    text={coverText}
                    onClose={() => setModalOpen(false)}
                />
            )}
        </>
    );
}