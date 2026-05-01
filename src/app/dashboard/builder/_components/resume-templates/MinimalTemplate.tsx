import { ResumeData } from "@/types/resume-types";
import { Mail, Phone, MapPin, Globe } from "lucide-react";
import { FaLinkedinIn, FaGithub } from "react-icons/fa";

interface MinimalTemplateProps {
    data: ResumeData;
    accentColor: string;
}

const MinimalTemplate = ({ data, accentColor }: MinimalTemplateProps) => {
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

    return (
        <div className="max-w-4xl mx-auto bg-white text-gray-900">
            {/* ── Top accent bar ── */}
            <div className="h-1 w-full" style={{ background: accentColor }} />

            <div className="px-10 py-8">
                {/* ── Header ── */}
                <header className="mb-8">
                    <div className="flex items-end justify-between gap-4 flex-wrap mb-5">
                        <div>
                            <h1 className="text-5xl font-extralight tracking-tight text-gray-900 leading-none">
                                {data.personalInfo?.fullName || "Your Name"}
                            </h1>
                            {data.personalInfo?.profession && (
                                <p
                                    className="mt-2 text-sm font-medium uppercase tracking-[0.2em]"
                                    style={{ color: accentColor }}
                                >
                                    {data.personalInfo.profession}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="w-full h-px bg-gray-200 mb-5" />

                    {/* Contact row */}
                    <div className="flex flex-wrap gap-x-5 gap-y-2.5 text-sm text-gray-500">
                        {data.personalInfo?.email && (
                            <a
                                href={`https://mail.google.com/mail/?view=cm&fs=1&to=${data.personalInfo.email}&su=Regarding%20Your%20Resume&body=Hi`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 hover:text-gray-800 transition-colors"
                            >
                                <Mail size={13} style={{ color: accentColor }} />
                                <span>{data.personalInfo.email}</span>
                            </a>
                        )}
                        {data.personalInfo?.phone && (
                            <div className="flex items-center gap-1.5">
                                <Phone size={13} style={{ color: accentColor }} />
                                <span>{data.personalInfo.phone}</span>
                            </div>
                        )}
                        {data.personalInfo?.location && (
                            <div className="flex items-center gap-1.5">
                                <MapPin size={13} style={{ color: accentColor }} />
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
                                <FaLinkedinIn size={12} style={{ color: accentColor }} />
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
                                <FaGithub size={12} style={{ color: accentColor }} />
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
                                <Globe size={12} style={{ color: accentColor }} />
                                <span>{stripProtocol(data.personalInfo.website)}</span>
                            </a>
                        )}
                    </div>
                </header>

                {/* ── Summary ── */}
                {data.professionalSummary && (
                    <section className="mb-8">
                        <p className="text-gray-600 leading-relaxed text-sm border-l-2 pl-4 italic"
                            style={{ borderColor: accentColor + "60" }}>
                            {data.professionalSummary}
                        </p>
                    </section>
                )}

                {/* ── Experience ── */}
                {data.experience && data.experience.length > 0 && (
                    <section className="mb-8">
                        <SectionHeading accentColor={accentColor}>Experience</SectionHeading>
                        <div className="space-y-6">
                            {data.experience.map((exp, index) => (
                                <div key={index}>
                                    <div className="flex justify-between items-baseline gap-4 flex-wrap">
                                        <h3 className="font-semibold text-gray-900">
                                            {exp.position}
                                        </h3>
                                        <span className="text-xs text-gray-400 whitespace-nowrap tabular-nums">
                                            {formatDate(exp.startDate)} – {exp.isCurrent ? "Present" : formatDate(exp.endDate)}
                                        </span>
                                    </div>
                                    <p className="text-sm font-medium mt-0.5" style={{ color: accentColor }}>
                                        {exp.company}
                                    </p>
                                    {exp.description && (
                                        <ul className="mt-2 space-y-1">
                                            {exp.description.split("\n").map((line, i) =>
                                                line.trim() ? (
                                                    <li key={i} className="text-sm text-gray-600 leading-relaxed flex gap-2">
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
                    <section className="mb-8">
                        <SectionHeading accentColor={accentColor}>Projects</SectionHeading>
                        <div className="space-y-4">
                            {data.project.map((proj, index) => (
                                <div key={index}>
                                    <div className="flex items-baseline gap-3 flex-wrap">
                                        <h3 className="font-semibold text-gray-900">{proj.name}</h3>
                                        {proj.type && (
                                            <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                                                style={{ background: accentColor + "15", color: accentColor }}>
                                                {proj.type}
                                            </span>
                                        )}
                                    </div>
                                    {proj.description && (
                                        <ul className="mt-1.5 space-y-1">
                                            {proj.description.split("\n").map((line, i) =>
                                                line.trim() ? (
                                                    <li key={i} className="text-sm text-gray-600 leading-relaxed flex gap-2">
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

                {/* ── Education ── */}
                {data.education && data.education.length > 0 && (
                    <section className="mb-8">
                        <SectionHeading accentColor={accentColor}>Education</SectionHeading>
                        <div className="space-y-4">
                            {data.education.map((edu, index) => (
                                <div key={index} className="flex justify-between items-start gap-4 flex-wrap">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">
                                            {edu.degree}{edu.field && ` in ${edu.field}`}
                                        </h3>
                                        <p className="text-sm text-gray-500 mt-0.5">{edu.institution}</p>
                                        {edu.gpa && (
                                            <p className="text-xs text-gray-400 mt-0.5">GPA: {edu.gpa}</p>
                                        )}
                                    </div>
                                    <span className="text-xs text-gray-400 whitespace-nowrap tabular-nums pt-0.5">
                                        {formatDate(edu.graduationDate)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* ── Skills ── */}
                {data.skills && data.skills.length > 0 && (
                    <section>
                        <SectionHeading accentColor={accentColor}>Skills</SectionHeading>
                        <div className="flex flex-wrap gap-2">
                            {data.skills.map((skill, index) => (
                                <span
                                    key={index}
                                    className="text-xs px-3 py-1 rounded-sm border text-gray-600"
                                    style={{ borderColor: accentColor + "40" }}
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </section>
                )}
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
        <h2
            className="text-xs font-semibold uppercase tracking-[0.18em] whitespace-nowrap"
            style={{ color: accentColor }}
        >
            {children}
        </h2>
        <div className="h-px flex-1 bg-gray-200" />
    </div>
);

export default MinimalTemplate;