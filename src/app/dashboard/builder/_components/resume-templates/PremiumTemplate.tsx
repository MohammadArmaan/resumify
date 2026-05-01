import { ResumeData } from "@/types/resume-types";
import { Mail, Phone, MapPin, Globe } from "lucide-react";
import { FaLinkedinIn, FaGithub } from "react-icons/fa6";

interface PremiumTemplateProps {
    data: ResumeData;
    accentColor: string;
}

const PremiumTemplate = ({ data, accentColor }: PremiumTemplateProps) => {
    const formatDate = (dateStr: string) => {
        if (!dateStr) return "";
        const [year, month] = dateStr.split("-");
        return new Date(Number(year), Number(month) - 1).toLocaleDateString(
            "en-US",
            { year: "numeric", month: "short" },
        );
    };

    const stripProtocol = (url: string) => url?.split("https://")[1] ?? url;
    const stripWww = (url: string) =>
        url?.split("https://www.")[1] ?? stripProtocol(url);

    const sidebarBg = "#1C1C1E";

    const monogram = data.personalInfo?.fullName
        ?.split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("") || "?";

    return (
        <div
            className="max-w-5xl mx-auto flex bg-white text-gray-900 overflow-hidden shadow-2xl"
            style={{
                minHeight: "29.7cm",
                fontFamily: "'Georgia', 'Times New Roman', serif",
            }}
        >
            {/* ─── SIDEBAR ─────────────────────────────────────────────── */}
            <aside
                className="w-72 flex-shrink-0 flex flex-col"
                style={{ backgroundColor: sidebarBg }}
            >
                {/* Profile image or monogram */}
                <div className="flex items-center justify-center" style={{ height: "200px" }}>
                    {data.personalInfo?.image ? (
                        <div
                            className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/20 shadow-lg"
                            style={{ backgroundColor: accentColor }}
                        >
                            <img
                                src={
                                    typeof data.personalInfo.image === "string"
                                        ? data.personalInfo.image
                                        : URL.createObjectURL(data.personalInfo.image)
                                }
                                alt={data.personalInfo.fullName}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ) : (
                        <div
                            className="w-32 h-32 rounded-full border-4 border-white/10 flex items-center justify-center shadow-lg select-none"
                            style={{ backgroundColor: accentColor + "30" }}
                        >
                            <span
                                className="text-3xl font-bold font-sans"
                                style={{ color: accentColor }}
                            >
                                {monogram}
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex-1 p-7 space-y-6">
                    {/* Name + profession */}
                    <div>
                        <p
                            className="text-white font-bold text-xl leading-tight"
                            style={{ fontFamily: "'Georgia', serif", letterSpacing: "-0.01em" }}
                        >
                            {data.personalInfo?.fullName || "Your Name"}
                        </p>
                        <p
                            className="mt-1 text-xs tracking-[0.2em] uppercase font-sans font-medium"
                            style={{ color: accentColor }}
                        >
                            {data.personalInfo?.profession || "Professional"}
                        </p>
                    </div>

                    <div className="h-px w-full" style={{ backgroundColor: accentColor, opacity: 0.3 }} />

                    {/* Contact */}
                    <div>
                        <p
                            className="text-[9px] tracking-[0.3em] uppercase font-sans mb-3"
                            style={{ color: accentColor }}
                        >
                            Contact
                        </p>
                        <ul className="space-y-2.5">
                            {data.personalInfo?.email && (
                                <li>
                                    <a
                                        href={`https://mail.google.com/mail/?view=cm&fs=1&to=${data.personalInfo.email}&su=Regarding%20Your%20Resume&body=Hi`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-start gap-3 group"
                                    >
                                        <Mail size={12} className="mt-0.5 flex-shrink-0" style={{ color: accentColor }} />
                                        <span className="text-gray-300 text-xs font-sans leading-tight break-all group-hover:text-white transition-colors">
                                            {data.personalInfo.email}
                                        </span>
                                    </a>
                                </li>
                            )}
                            {data.personalInfo?.phone && (
                                <li className="flex items-center gap-3">
                                    <Phone size={12} className="flex-shrink-0" style={{ color: accentColor }} />
                                    <span className="text-gray-300 text-xs font-sans">
                                        {data.personalInfo.phone}
                                    </span>
                                </li>
                            )}
                            {data.personalInfo?.location && (
                                <li className="flex items-center gap-3">
                                    <MapPin size={12} className="flex-shrink-0" style={{ color: accentColor }} />
                                    <span className="text-gray-300 text-xs font-sans">
                                        {data.personalInfo.location}
                                    </span>
                                </li>
                            )}
                            {data.personalInfo?.linkedin && (
                                <li>
                                    <a
                                        href={data.personalInfo.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-start gap-3 group"
                                    >
                                        <FaLinkedinIn size={12} className="mt-0.5 flex-shrink-0" style={{ color: accentColor }} />
                                        <span className="text-gray-300 text-xs font-sans break-all leading-tight group-hover:text-white transition-colors">
                                            {stripWww(data.personalInfo.linkedin)}
                                        </span>
                                    </a>
                                </li>
                            )}
                            {data.personalInfo?.github && (
                                <li>
                                    <a
                                        href={data.personalInfo.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-start gap-3 group"
                                    >
                                        <FaGithub size={12} className="mt-0.5 flex-shrink-0" style={{ color: accentColor }} />
                                        <span className="text-gray-300 text-xs font-sans break-all leading-tight group-hover:text-white transition-colors">
                                            {stripProtocol(data.personalInfo.github)}
                                        </span>
                                    </a>
                                </li>
                            )}
                            {data.personalInfo?.website && (
                                <li>
                                    <a
                                        href={data.personalInfo.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-start gap-3 group"
                                    >
                                        <Globe size={12} className="mt-0.5 flex-shrink-0" style={{ color: accentColor }} />
                                        <span className="text-gray-300 text-xs font-sans break-all leading-tight group-hover:text-white transition-colors">
                                            {stripProtocol(data.personalInfo.website)}
                                        </span>
                                    </a>
                                </li>
                            )}
                        </ul>
                    </div>

                    <div className="h-px w-full" style={{ backgroundColor: accentColor, opacity: 0.3 }} />

                    {/* Skills */}
                    {data.skills && data.skills.length > 0 && (
                        <div>
                            <p
                                className="text-[9px] tracking-[0.3em] uppercase font-sans mb-4"
                                style={{ color: accentColor }}
                            >
                                Expertise
                            </p>
                            <ul className="space-y-2">
                                {data.skills.map((skill, i) => (
                                    <li key={i} className="flex items-center gap-2">
                                        <span
                                            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                            style={{ backgroundColor: accentColor }}
                                        />
                                        <span className="text-gray-300 text-xs font-sans">
                                            {skill}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Education */}
                    {data.education && data.education.length > 0 && (
                        <>
                            <div className="h-px w-full" style={{ backgroundColor: accentColor, opacity: 0.3 }} />
                            <div>
                                <p
                                    className="text-[9px] tracking-[0.3em] uppercase font-sans mb-4"
                                    style={{ color: accentColor }}
                                >
                                    Education
                                </p>
                                <div className="space-y-4">
                                    {data.education.map((edu, i) => (
                                        <div key={i}>
                                            <p className="text-white text-xs font-semibold font-sans leading-tight">
                                                {edu.degree}{edu.field && ` · ${edu.field}`}
                                            </p>
                                            <p className="text-gray-400 text-xs font-sans mt-0.5">
                                                {edu.institution}
                                            </p>
                                            <p className="text-gray-500 text-[10px] font-sans mt-0.5">
                                                {formatDate(edu.graduationDate)}
                                                {edu.gpa && ` · GPA ${edu.gpa}`}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </aside>

            {/* ─── MAIN CONTENT ─────────────────────────────────────────── */}
            <main className="flex-1 p-10 space-y-8">

                {/* Summary */}
                {data.professionalSummary && (
                    <section>
                        <SectionHeading label="Profile" accentColor={accentColor} />
                        <p className="font-sans text-sm text-gray-700 leading-relaxed">
                            {data.professionalSummary}
                        </p>
                    </section>
                )}

                {/* Experience */}
                {data.experience && data.experience.length > 0 && (
                    <section>
                        <SectionHeading label="Experience" accentColor={accentColor} />
                        <div className="space-y-7">
                            {data.experience.map((exp, i) => (
                                <div key={i} className="relative">
                                    <div
                                        className="absolute left-0 top-0 bottom-0 w-0.5"
                                        style={{ backgroundColor: accentColor, opacity: 0.35 }}
                                    />
                                    <div className="pl-5">
                                        <div className="flex justify-between items-start gap-4">
                                            <div>
                                                <h3
                                                    className="font-bold text-gray-900 text-base leading-tight"
                                                    style={{ fontFamily: "'Georgia', serif" }}
                                                >
                                                    {exp.position}
                                                </h3>
                                                <p
                                                    className="font-sans text-xs tracking-widest uppercase mt-0.5"
                                                    style={{ color: accentColor }}
                                                >
                                                    {exp.company}
                                                </p>
                                            </div>
                                            <span className="font-sans text-[10px] text-gray-400 whitespace-nowrap mt-0.5 border border-gray-200 px-2 py-0.5 rounded-sm">
                                                {formatDate(exp.startDate)} –{" "}
                                                {exp.isCurrent ? "Present" : formatDate(exp.endDate)}
                                            </span>
                                        </div>
                                        {exp.description && (
                                            <ul className="mt-2.5 space-y-1">
                                                {exp.description.split("\n").map((line, j) =>
                                                    line.trim() ? (
                                                        <li key={j} className="flex gap-2.5 font-sans text-sm text-gray-600 leading-relaxed">
                                                            <span
                                                                className="mt-2 w-1 h-1 rounded-full flex-shrink-0"
                                                                style={{ backgroundColor: accentColor, opacity: 0.6 }}
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

                {/* Projects */}
                {data.project && data.project.length > 0 && (
                    <section>
                        <SectionHeading label="Selected Projects" accentColor={accentColor} />
                        <div className="grid grid-cols-1 gap-5">
                            {data.project.map((proj, i) => (
                                <div
                                    key={i}
                                    className="border border-gray-100 rounded-sm p-4 relative overflow-hidden"
                                >
                                    <div
                                        className="absolute top-0 left-0 w-1 h-full"
                                        style={{ backgroundColor: accentColor }}
                                    />
                                    <div className="pl-3">
                                        <div className="flex items-baseline gap-3">
                                            <h3
                                                className="font-bold text-gray-900 text-sm"
                                                style={{ fontFamily: "'Georgia', serif" }}
                                            >
                                                {proj.name}
                                            </h3>
                                            {proj.type && (
                                                <span className="font-sans text-[9px] tracking-widest uppercase text-gray-400">
                                                    {proj.type}
                                                </span>
                                            )}
                                        </div>
                                        {proj.description && (
                                            <ul className="mt-2 space-y-1">
                                                {proj.description.split("\n").map((line, j) =>
                                                    line.trim() ? (
                                                        <li key={j} className="flex gap-2.5 font-sans text-xs text-gray-600 leading-relaxed">
                                                            <span
                                                                className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0"
                                                                style={{ backgroundColor: accentColor, opacity: 0.6 }}
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
            </main>
        </div>
    );
};

const SectionHeading = ({
    label,
    accentColor,
}: {
    label: string;
    accentColor: string;
}) => (
    <div className="flex items-center gap-3 mb-5">
        <span className="w-4 h-0.5 flex-shrink-0" style={{ backgroundColor: accentColor }} />
        <h2 className="text-[10px] tracking-[0.3em] uppercase font-sans font-semibold text-gray-500">
            {label}
        </h2>
        <div className="flex-1 h-px bg-gray-100" />
    </div>
);

export default PremiumTemplate;