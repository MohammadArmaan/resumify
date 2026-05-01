import { ResumeData } from "@/types/resume-types";
import { Mail, Phone, MapPin, Globe } from "lucide-react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa6";

interface ModernTemplateProps {
    data: ResumeData;
    accentColor: string;
}

const ModernTemplate = ({ data, accentColor }: ModernTemplateProps) => {
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const [year, month] = dateStr.split("-");
        return new Date(year, month - 1).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
        });
    };

    const stripProtocol = (url: string) => url?.split("https://")[1] ?? url;
    const stripWww = (url: string) => url?.split("https://www.")[1] ?? stripProtocol(url);

    const accentBorder = accentColor + "50";

    return (
        <div className="max-w-4xl mx-auto bg-white text-gray-800">

            {/* ── Header ── */}
            <header style={{ backgroundColor: accentColor }}>
                <div className="px-10 pt-10 pb-8">
                    {/* Profession label */}
                    {data.personalInfo?.profession && (
                        <p className="text-white/60 text-xs tracking-[0.25em] uppercase font-medium mb-1">
                            {data.personalInfo.profession}
                        </p>
                    )}

                    <h1 className="text-5xl font-light text-white mb-6 tracking-tight">
                        {data.personalInfo?.fullName || "Your Name"}
                    </h1>

                    {/* Divider */}
                    <div className="w-full h-px bg-white/20 mb-5" />

                    {/* Contact grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2.5 text-sm text-white/80">
                        {data.personalInfo?.email && (
                            <a
                                href={`https://mail.google.com/mail/?view=cm&fs=1&to=${data.personalInfo.email}&su=Regarding%20Your%20Resume&body=Hi`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 hover:text-white transition-colors"
                            >
                                <Mail size={13} className="shrink-0 opacity-70" />
                                <span className="truncate">{data.personalInfo.email}</span>
                            </a>
                        )}
                        {data.personalInfo?.phone && (
                            <div className="flex items-center gap-2">
                                <Phone size={13} className="shrink-0 opacity-70" />
                                <span>{data.personalInfo.phone}</span>
                            </div>
                        )}
                        {data.personalInfo?.location && (
                            <div className="flex items-center gap-2">
                                <MapPin size={13} className="shrink-0 opacity-70" />
                                <span>{data.personalInfo.location}</span>
                            </div>
                        )}
                        {data.personalInfo?.linkedin && (
                            <a
                                href={data.personalInfo.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 hover:text-white transition-colors"
                            >
                                <FaLinkedinIn size={12} className="shrink-0 opacity-70" />
                                <span className="text-xs truncate">{stripWww(data.personalInfo.linkedin)}</span>
                            </a>
                        )}
                        {data.personalInfo?.github && (
                            <a
                                href={data.personalInfo.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 hover:text-white transition-colors"
                            >
                                <FaGithub size={12} className="shrink-0 opacity-70" />
                                <span className="text-xs truncate">{stripProtocol(data.personalInfo.github)}</span>
                            </a>
                        )}
                        {data.personalInfo?.website && (
                            <a
                                href={data.personalInfo.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 hover:text-white transition-colors"
                            >
                                <Globe size={12} className="shrink-0 opacity-70" />
                                <span className="text-xs truncate">{stripProtocol(data.personalInfo.website)}</span>
                            </a>
                        )}
                    </div>
                </div>
            </header>

            {/* ── Body ── */}
            <div className="px-10 py-8 space-y-8">

                {/* ── Summary ── */}
                {data.professionalSummary && (
                    <section>
                        <SectionHeading accentColor={accentColor}>Professional Summary</SectionHeading>
                        <p className="text-gray-600 leading-relaxed text-sm">
                            {data.professionalSummary}
                        </p>
                    </section>
                )}

                {/* ── Experience ── */}
                {data.experience && data.experience.length > 0 && (
                    <section>
                        <SectionHeading accentColor={accentColor}>Experience</SectionHeading>
                        <div className="space-y-6">
                            {data.experience.map((exp, index) => (
                                <div
                                    key={index}
                                    className="relative pl-5 border-l-2"
                                    style={{ borderColor: accentBorder }}
                                >
                                    {/* Timeline dot */}
                                    <div
                                        className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full ring-2 ring-white"
                                        style={{ background: accentColor }}
                                    />

                                    <div className="flex justify-between items-start gap-4 flex-wrap mb-1">
                                        <div>
                                            <h3 className="text-base font-semibold text-gray-900">
                                                {exp.position}
                                            </h3>
                                            <p className="text-sm font-medium mt-0.5" style={{ color: accentColor }}>
                                                {exp.company}
                                            </p>
                                        </div>
                                        <span className="text-xs text-gray-400 whitespace-nowrap tabular-nums">
                                            {formatDate(exp.startDate)} – {exp.isCurrent ? "Present" : formatDate(exp.endDate)}
                                        </span>
                                    </div>
                                    {exp.description && (
                                        <ul className="mt-2 space-y-1">
                                            {exp.description.split("\n").map((line, i) =>
                                                line.trim() ? (
                                                    <li key={i} className="flex gap-2 text-sm text-gray-600 leading-relaxed">
                                                        <span className="mt-2 w-1 h-1 rounded-full shrink-0" style={{ background: accentColor }} />
                                                        {line}
                                                    </li>
                                                ) : null
                                            )}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* ── Projects ── */}
                {data.project && data.project.length > 0 && (
                    <section>
                        <SectionHeading accentColor={accentColor}>Projects</SectionHeading>
                        <div className="grid grid-cols-1 gap-4">
                            {data.project.map((p, index) => (
                                <div
                                    key={index}
                                    className="border border-gray-100 rounded-lg p-4"
                                >
                                    <div className="flex items-center gap-2 flex-wrap mb-1">
                                        <h3 className="text-sm font-semibold text-gray-900">{p.name}</h3>
                                        {p.type && (
                                            <span
                                                className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                                                style={{ background: accentColor + "20", color: accentColor }}
                                            >
                                                {p.type}
                                            </span>
                                        )}
                                    </div>
                                    {p.description && (
                                        <ul className="space-y-1 mt-1">
                                            {p.description.split("\n").map((line, i) =>
                                                line.trim() ? (
                                                    <li key={i} className="flex gap-2 text-sm text-gray-600 leading-relaxed">
                                                        <span className="mt-2 w-1 h-1 rounded-full shrink-0" style={{ background: accentColor }} />
                                                        {line}
                                                    </li>
                                                ) : null
                                            )}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* ── Education + Skills ── */}
                <div className="grid sm:grid-cols-2 gap-8">
                    {data.education && data.education.length > 0 && (
                        <section>
                            <SectionHeading accentColor={accentColor}>Education</SectionHeading>
                            <div className="space-y-4">
                                {data.education.map((edu, index) => (
                                    <div
                                        key={index}
                                        className="pl-4 border-l-2"
                                        style={{ borderColor: accentBorder }}
                                    >
                                        <h3 className="font-semibold text-gray-900 text-sm">
                                            {edu.degree}{edu.field && ` in ${edu.field}`}
                                        </h3>
                                        <p className="text-xs font-medium mt-0.5" style={{ color: accentColor }}>
                                            {edu.institution}
                                        </p>
                                        <div className="flex gap-3 text-xs text-gray-400 mt-0.5">
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
                            <SectionHeading accentColor={accentColor}>Skills</SectionHeading>
                            <div className="flex flex-wrap gap-2">
                                {data.skills.map((skill, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 text-xs font-medium rounded-full border"
                                        style={{
                                            color: accentColor,
                                            borderColor: accentBorder,
                                        }}
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
};

/* ── Helper ── */
const SectionHeading = ({
    children,
    accentColor,
}: {
    children: React.ReactNode;
    accentColor: string;
}) => (
    <div className="flex items-center gap-3 mb-4">
        <h2 className="text-xs font-bold uppercase tracking-[0.18em] whitespace-nowrap text-gray-400">
            {children}
        </h2>
        <div className="flex-1 h-px" style={{ background: accentColor + "30" }} />
    </div>
);

export default ModernTemplate;