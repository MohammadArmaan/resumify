import { ResumeData } from "@/types/resume-types";
import { Mail, Phone, MapPin, Globe } from "lucide-react";
import { FaLinkedinIn, FaGithub } from "react-icons/fa";

interface ExecutiveTemplateProps {
    data: ResumeData;
    accentColor: string;
}

const ExecutiveTemplate = ({ data, accentColor }: ExecutiveTemplateProps) => {
    const formatDate = (dateStr: string) => {
        if (!dateStr) return "";
        const [year, month] = dateStr.split("-");
        return new Date(Number(year), Number(month) - 1).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
        });
    };

    const stripProtocol = (url: string) => url?.split("https://")[1] ?? url;
    const stripWww = (url: string) => url?.split("https://www.")[1] ?? stripProtocol(url);

    return (
        <div
            className="max-w-4xl mx-auto bg-white text-gray-900"
            style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
        >
            {/* Top accent bar */}
            <div className="h-1 w-full" style={{ backgroundColor: accentColor }} />

            {/* ── Header ── */}
            <header className="px-12 pt-10 pb-8">
                {/* Profession label */}
                <p
                    className="text-[10px] font-sans tracking-[0.35em] uppercase font-semibold mb-2"
                    style={{ color: accentColor }}
                >
                    {data.personalInfo?.profession || "Professional"}
                </p>

                {/* Name */}
                <h1
                    className="text-6xl font-bold tracking-tight text-gray-900 leading-none mb-6"
                    style={{ letterSpacing: "-0.02em" }}
                >
                    {data.personalInfo?.fullName || "Your Name"}
                </h1>

                {/* Divider */}
                <div className="w-full h-px bg-gray-200 mb-6" />

                {/* Contact row — icons + collapsed links, inline */}
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2.5 font-sans text-xs text-gray-500">
                    {data.personalInfo?.email && (
                        <a
                            href={`https://mail.google.com/mail/?view=cm&fs=1&to=${data.personalInfo.email}&su=Regarding%20Your%20Resume&body=Hi`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 hover:text-gray-800 transition-colors"
                        >
                            <Mail size={11} style={{ color: accentColor }} />
                            <span>{data.personalInfo.email}</span>
                        </a>
                    )}
                    {data.personalInfo?.phone && (
                        <div className="flex items-center gap-1.5">
                            <Phone size={11} style={{ color: accentColor }} />
                            <span>{data.personalInfo.phone}</span>
                        </div>
                    )}
                    {data.personalInfo?.location && (
                        <div className="flex items-center gap-1.5">
                            <MapPin size={11} style={{ color: accentColor }} />
                            <span>{data.personalInfo.location}</span>
                        </div>
                    )}
                    {data.personalInfo?.linkedin && (
                        <a
                            href={data.personalInfo.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 hover:text-gray-800 transition-colors"
                        >
                            <FaLinkedinIn size={11} style={{ color: accentColor }} />
                            <span>{stripWww(data.personalInfo.linkedin)}</span>
                        </a>
                    )}
                    {data.personalInfo?.github && (
                        <a
                            href={data.personalInfo.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 hover:text-gray-800 transition-colors"
                        >
                            <FaGithub size={11} style={{ color: accentColor }} />
                            <span>{stripProtocol(data.personalInfo.github)}</span>
                        </a>
                    )}
                    {data.personalInfo?.website && (
                        <a
                            href={data.personalInfo.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 hover:text-gray-800 transition-colors"
                        >
                            <Globe size={11} style={{ color: accentColor }} />
                            <span>{stripProtocol(data.personalInfo.website)}</span>
                        </a>
                    )}
                </div>
            </header>

            <div className="px-12 pb-10 space-y-8">

                {/* ── Summary ── */}
                {data.professionalSummary && (
                    <section>
                        <SectionRule accentColor={accentColor} label="Profile" />
                        <p className="font-sans text-sm text-gray-600 leading-relaxed max-w-2xl">
                            {data.professionalSummary}
                        </p>
                    </section>
                )}

                {/* ── Experience ── */}
                {data.experience && data.experience.length > 0 && (
                    <section>
                        <SectionRule accentColor={accentColor} label="Experience" />
                        <div className="space-y-7">
                            {data.experience.map((exp, index) => (
                                <div key={index} className="grid grid-cols-4 gap-6">
                                    {/* Date column */}
                                    <div className="col-span-1 pt-0.5">
                                        <p className="font-sans text-[11px] text-gray-400 leading-relaxed">
                                            {formatDate(exp.startDate)}
                                        </p>
                                        <p className="font-sans text-[11px] text-gray-300">—</p>
                                        <p className="font-sans text-[11px]"
                                            style={{ color: exp.isCurrent ? accentColor : "#9ca3af" }}>
                                            {exp.isCurrent ? "Present" : formatDate(exp.endDate)}
                                        </p>
                                    </div>

                                    {/* Content column */}
                                    <div className="col-span-3">
                                        <h3 className="font-bold text-gray-900 text-base leading-tight">
                                            {exp.position}
                                        </h3>
                                        <p
                                            className="font-sans text-[11px] tracking-widest uppercase mt-0.5 mb-2.5 font-medium"
                                            style={{ color: accentColor }}
                                        >
                                            {exp.company}
                                        </p>
                                        {exp.description && (
                                            <ul className="space-y-1">
                                                {exp.description.split("\n").map((line, i) =>
                                                    line.trim() ? (
                                                        <li key={i} className="flex gap-2.5 font-sans text-sm text-gray-600 leading-relaxed">
                                                            <span
                                                                className="mt-2 w-1 h-1 rounded-full shrink-0"
                                                                style={{ background: accentColor }}
                                                            />
                                                            {line}
                                                        </li>
                                                    ) : null
                                                )}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* ── Projects ── */}
                {data.project && data.project.length > 0 && (
                    <section>
                        <SectionRule accentColor={accentColor} label="Projects" />
                        <div className="space-y-5">
                            {data.project.map((proj, index) => (
                                <div key={index} className="grid grid-cols-4 gap-6">
                                    <div className="col-span-1 pt-0.5">
                                        {proj.type && (
                                            <span
                                                className="font-sans text-[10px] px-2 py-0.5 rounded-sm font-medium uppercase tracking-wide"
                                                style={{ background: accentColor + "15", color: accentColor }}
                                            >
                                                {proj.type}
                                            </span>
                                        )}
                                    </div>
                                    <div className="col-span-3">
                                        <h3 className="font-bold text-gray-900 text-base leading-tight">
                                            {proj.name}
                                        </h3>
                                        {proj.description && (
                                            <ul className="mt-1.5 space-y-1">
                                                {proj.description.split("\n").map((line, i) =>
                                                    line.trim() ? (
                                                        <li key={i} className="flex gap-2.5 font-sans text-sm text-gray-600 leading-relaxed">
                                                            <span
                                                                className="mt-2 w-1 h-1 rounded-full shrink-0"
                                                                style={{ background: accentColor }}
                                                            />
                                                            {line}
                                                        </li>
                                                    ) : null
                                                )}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* ── Education + Skills ── */}
                <div className="grid grid-cols-2 gap-10">
                    {data.education && data.education.length > 0 && (
                        <section>
                            <SectionRule accentColor={accentColor} label="Education" />
                            <div className="space-y-4">
                                {data.education.map((edu, index) => (
                                    <div key={index}>
                                        <h3 className="font-bold text-gray-900 text-sm">
                                            {edu.degree}{edu.field && ` in ${edu.field}`}
                                        </h3>
                                        <p className="font-sans text-xs text-gray-500 mt-0.5">{edu.institution}</p>
                                        <div className="flex gap-3 font-sans text-xs text-gray-400 mt-0.5">
                                            <span>{formatDate(edu.graduationDate)}</span>
                                            {edu.gpa && <span>· GPA {edu.gpa}</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.skills && data.skills.length > 0 && (
                        <section>
                            <SectionRule accentColor={accentColor} label="Skills" />
                            <div className="flex flex-wrap gap-2">
                                {data.skills.map((skill, index) => (
                                    <span
                                        key={index}
                                        className="font-sans text-[11px] text-gray-600 border px-2.5 py-0.5 rounded-sm"
                                        style={{ borderColor: accentColor + "35" }}
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>

            {/* Bottom accent */}
            <div className="h-px w-full" style={{ backgroundColor: accentColor, opacity: 0.25 }} />
        </div>
    );
};

/* ── Section rule helper ── */
const SectionRule = ({
    label,
    accentColor,
}: {
    label: string;
    accentColor: string;
}) => (
    <div className="flex items-center gap-4 mb-5">
        <span
            className="font-sans text-[10px] tracking-[0.28em] uppercase font-semibold whitespace-nowrap"
            style={{ color: accentColor }}
        >
            {label}
        </span>
        <div className="flex-1 h-px bg-gray-200" />
    </div>
);

export default ExecutiveTemplate;