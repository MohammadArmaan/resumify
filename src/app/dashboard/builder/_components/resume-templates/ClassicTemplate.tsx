import { ResumeData } from "@/types/resume-types";
import { Mail, Phone, MapPin, Globe } from "lucide-react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa6";

interface ClassicTemplateProps {
    data: ResumeData;
    accentColor: string;
}

const ClassicTemplate = ({ data, accentColor }: ClassicTemplateProps) => {
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
        <div className="max-w-4xl mx-auto p-10 bg-white text-gray-800 leading-relaxed">

            {/* ── Header ── */}
            <header className="text-center mb-8">
                <h1
                    className="text-3xl font-bold mb-1 tracking-tight"
                    style={{ color: accentColor }}
                >
                    {data.personalInfo?.fullName || "Your Name"}
                </h1>
                {data.personalInfo?.profession && (
                    <p className="text-sm text-gray-500 mb-4 tracking-wide">
                        {data.personalInfo.profession}
                    </p>
                )}

                {/* Single clean rule */}
                <div className="w-full h-px bg-gray-300 mb-4" />

                {/* Contact */}
                <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-gray-500">
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

            <div className="space-y-6">

                {/* ── Summary ── */}
                {data.professionalSummary && (
                    <section>
                        <h2 className="text-base font-bold uppercase tracking-widest mb-2" style={{ color: accentColor }}>
                            Professional Summary
                        </h2>
                        <div className="w-full h-px bg-gray-200 mb-3" />
                        <p className="text-gray-700 text-sm leading-relaxed">
                            {data.professionalSummary}
                        </p>
                    </section>
                )}

                {/* ── Experience ── */}
                {data.experience && data.experience.length > 0 && (
                    <section>
                        <h2 className="text-base font-bold uppercase tracking-widest mb-2" style={{ color: accentColor }}>
                            Professional Experience
                        </h2>
                        <div className="w-full h-px bg-gray-200 mb-3" />
                        <div className="space-y-5">
                            {data.experience.map((exp, index) => (
                                <div key={index}>
                                    <div className="flex justify-between items-start gap-4 flex-wrap">
                                        <div>
                                            <h3 className="font-semibold text-gray-900 text-sm">{exp.position}</h3>
                                            <p className="text-sm" style={{ color: accentColor }}>{exp.company}</p>
                                        </div>
                                        <p className="text-xs text-gray-400 whitespace-nowrap tabular-nums pt-0.5">
                                            {formatDate(exp.startDate)} – {exp.isCurrent ? "Present" : formatDate(exp.endDate)}
                                        </p>
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
                        <h2 className="text-base font-bold uppercase tracking-widest mb-2" style={{ color: accentColor }}>
                            Projects
                        </h2>
                        <div className="w-full h-px bg-gray-200 mb-3" />
                        <div className="space-y-4">
                            {data.project.map((proj, index) => (
                                <div key={index}>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h3 className="font-semibold text-gray-900 text-sm">{proj.name}</h3>
                                        {proj.type && (
                                            <span className="text-xs text-gray-400 italic">— {proj.type}</span>
                                        )}
                                    </div>
                                    {proj.description && (
                                        <ul className="mt-1 space-y-1">
                                            {proj.description.split("\n").map((line, i) =>
                                                line.trim() ? (
                                                    <li key={i} className="flex gap-2 text-sm text-gray-600 leading-relaxed">
                                                        <span className="mt-2 w-1 h-1 rounded-full shrink-0 bg-gray-400" />
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
                    <section>
                        <h2 className="text-base font-bold uppercase tracking-widest mb-2" style={{ color: accentColor }}>
                            Education
                        </h2>
                        <div className="w-full h-px bg-gray-200 mb-3" />
                        <div className="space-y-3">
                            {data.education.map((edu, index) => (
                                <div key={index} className="flex justify-between items-start gap-4 flex-wrap">
                                    <div>
                                        <h3 className="font-semibold text-gray-900 text-sm">
                                            {edu.degree}{edu.field && ` in ${edu.field}`}
                                        </h3>
                                        <p className="text-sm text-gray-600">{edu.institution}</p>
                                        {edu.gpa && <p className="text-xs text-gray-400">GPA: {edu.gpa}</p>}
                                    </div>
                                    <p className="text-xs text-gray-400 whitespace-nowrap tabular-nums pt-0.5">
                                        {formatDate(edu.graduationDate)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* ── Skills ── */}
                {data.skills && data.skills.length > 0 && (
                    <section>
                        <h2 className="text-base font-bold uppercase tracking-widest mb-2" style={{ color: accentColor }}>
                            Core Skills
                        </h2>
                        <div className="w-full h-px bg-gray-200 mb-3" />
                        <div className="flex flex-wrap gap-x-6 gap-y-1.5">
                            {data.skills.map((skill, index) => (
                                <div key={index} className="flex items-center gap-1.5 text-sm text-gray-700">
                                    <span className="w-1 h-1 rounded-full" style={{ background: accentColor }} />
                                    {skill}
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default ClassicTemplate;