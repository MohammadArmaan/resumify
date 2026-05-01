import { ResumeData } from "@/types/resume-types";
import { Mail, Phone, MapPin, Globe } from "lucide-react";
import { FaLinkedinIn, FaGithub } from "react-icons/fa";

interface MinimalImageTemplateProps {
    data: ResumeData;
    accentColor: string;
}

const MinimalImageTemplate = ({ data, accentColor }: MinimalImageTemplateProps) => {
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const [year, month] = dateStr.split("-");
        return new Date(year, month - 1).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
        });
    };

    const stripProtocol = (url: string, prefix = "https://") =>
        url?.split(prefix)[1] ?? url;

    const stripWww = (url: string) =>
        url?.split("https://www.")[1] ?? stripProtocol(url);

    return (
        <div className="max-w-5xl mx-auto bg-white text-zinc-800 shadow-sm">
            {/* ── Header ── */}
            <div
                className="grid grid-cols-3 border-b border-zinc-200"
                style={{ borderBottomColor: accentColor + "30" }}
            >
                {/* Profile image cell */}
                <div className="col-span-1 flex items-center justify-center py-10 px-6">
                    {data.personalInfo?.image ? (
                        <img
                            src={
                                typeof data.personalInfo.image === "string"
                                    ? data.personalInfo.image
                                    : URL.createObjectURL(data.personalInfo.image)
                            }
                            alt="Profile"
                            className="w-28 h-28 object-cover rounded-full"
                            style={{ background: accentColor + "20" }}
                        />
                    ) : (
                        /* Monogram placeholder */
                        <div
                            className="w-28 h-28 rounded-full flex items-center justify-center text-3xl font-bold text-white select-none"
                            style={{ background: accentColor + "90" }}
                        >
                            {data.personalInfo?.fullName
                                ?.split(" ")
                                .map((n) => n[0])
                                .slice(0, 2)
                                .join("") || "?"}
                        </div>
                    )}
                </div>

                {/* Name / title cell */}
                <div className="col-span-2 flex flex-col justify-center py-10 px-8 border-l border-zinc-100">
                    <h1 className="text-4xl font-bold text-zinc-800 tracking-wide leading-tight">
                        {data.personalInfo?.fullName || "Your Name"}
                    </h1>
                    <p
                        className="mt-1 text-sm font-semibold uppercase tracking-widest"
                        style={{ color: accentColor }}
                    >
                        {data.personalInfo?.profession || "Profession"}
                    </p>
                </div>
            </div>

            {/* ── Body ── */}
            <div className="grid grid-cols-3">
                {/* ── Left Sidebar ── */}
                <aside
                    className="col-span-1 p-6 space-y-7 border-r border-zinc-200"
                    style={{ borderRightColor: accentColor + "30" }}
                >
                    {/* Contact */}
                    <section>
                        <SidebarHeading>Contact</SidebarHeading>
                        <div className="space-y-2.5 text-sm text-zinc-700">
                            {data.personalInfo?.email && (
                                <a
                                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${data.personalInfo.email}&su=Regarding%20Your%20Resume&body=Hi`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-start gap-2 hover:underline break-all"
                                >
                                    <Mail size={13} className="mt-0.5 shrink-0" style={{ color: accentColor }} />
                                    <span>{data.personalInfo.email}</span>
                                </a>
                            )}
                            {data.personalInfo?.phone && (
                                <div className="flex items-center gap-2">
                                    <Phone size={13} className="shrink-0" style={{ color: accentColor }} />
                                    <span>{data.personalInfo.phone}</span>
                                </div>
                            )}
                            {data.personalInfo?.location && (
                                <div className="flex items-center gap-2">
                                    <MapPin size={13} className="shrink-0" style={{ color: accentColor }} />
                                    <span>{data.personalInfo.location}</span>
                                </div>
                            )}
                            {data.personalInfo?.linkedin && (
                                <a
                                    href={data.personalInfo.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-start gap-2 hover:underline break-all"
                                >
                                    <FaLinkedinIn size={13} className="mt-0.5 shrink-0" style={{ color: accentColor }} />
                                    <span className="text-xs">{stripWww(data.personalInfo.linkedin)}</span>
                                </a>
                            )}
                            {data.personalInfo?.github && (
                                <a
                                    href={data.personalInfo.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-start gap-2 hover:underline break-all"
                                >
                                    <FaGithub size={13} className="mt-0.5 shrink-0" style={{ color: accentColor }} />
                                    <span className="text-xs">{stripProtocol(data.personalInfo.github)}</span>
                                </a>
                            )}
                            {data.personalInfo?.website && (
                                <a
                                    href={data.personalInfo.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-start gap-2 hover:underline break-all"
                                >
                                    <Globe size={13} className="mt-0.5 shrink-0" style={{ color: accentColor }} />
                                    <span className="text-xs">{stripProtocol(data.personalInfo.website)}</span>
                                </a>
                            )}
                        </div>
                    </section>

                    {/* Education */}
                    {data.education && data.education.length > 0 && (
                        <section>
                            <SidebarHeading>Education</SidebarHeading>
                            <div className="space-y-4 text-sm">
                                {data.education.map((edu, index) => (
                                    <div key={index}>
                                        <p className="font-semibold text-zinc-800 uppercase tracking-wide text-xs leading-snug">
                                            {edu.degree}
                                        </p>
                                        <p className="text-zinc-600 mt-0.5">{edu.institution}</p>
                                        <p className="text-xs text-zinc-400 mt-0.5">
                                            {formatDate(edu.graduationDate)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Skills */}
                    {data.skills && data.skills.length > 0 && (
                        <section>
                            <SidebarHeading>Skills</SidebarHeading>
                            <ul className="space-y-1.5 text-sm text-zinc-700">
                                {data.skills.map((skill, index) => (
                                    <li key={index} className="flex items-center gap-2">
                                        <span
                                            className="inline-block w-1.5 h-1.5 rounded-full shrink-0"
                                            style={{ background: accentColor }}
                                        />
                                        {skill}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}
                </aside>

                {/* ── Main Content ── */}
                <main className="col-span-2 p-8 space-y-8">
                    {/* Summary */}
                    {data.professionalSummary && (
                        <section>
                            <MainHeading accentColor={accentColor}>Summary</MainHeading>
                            <p className="text-sm text-zinc-700 leading-relaxed mt-2">
                                {data.professionalSummary}
                            </p>
                        </section>
                    )}

                    {/* Experience */}
                    {data.experience && data.experience.length > 0 && (
                        <section>
                            <MainHeading accentColor={accentColor}>Experience</MainHeading>
                            <div className="space-y-6 mt-2">
                                {data.experience.map((exp, index) => (
                                    <div key={index} className="relative pl-3 border-l-2" style={{ borderColor: accentColor + "50" }}>
                                        <div className="flex justify-between items-start gap-2 flex-wrap">
                                            <h3 className="font-semibold text-zinc-900 text-sm">
                                                {exp.position}
                                            </h3>
                                            <span className="text-xs text-zinc-400 whitespace-nowrap">
                                                {formatDate(exp.startDate)} –{" "}
                                                {exp.isCurrent ? "Present" : formatDate(exp.endDate)}
                                            </span>
                                        </div>
                                        <p className="text-xs font-medium mt-0.5" style={{ color: accentColor }}>
                                            {exp.company}
                                        </p>
                                        {exp.description && (
                                            <ul className="mt-2 list-disc list-inside text-sm text-zinc-600 leading-relaxed space-y-1">
                                                {exp.description.split("\n").map((line, i) => (
                                                    line.trim() && <li key={i}>{line}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Projects */}
                    {data.project && data.project.length > 0 && (
                        <section>
                            <MainHeading accentColor={accentColor}>Projects</MainHeading>
                            <div className="space-y-5 mt-2">
                                {data.project.map((project, index) => (
                                    <div key={index} className="relative pl-3 border-l-2" style={{ borderColor: accentColor + "50" }}>
                                        <h3 className="text-sm font-semibold text-zinc-800">{project.name}</h3>
                                        <p className="text-xs font-medium mt-0.5" style={{ color: accentColor }}>
                                            {project.type}
                                        </p>
                                        {project.description && (
                                            <ul className="mt-1.5 list-disc list-inside text-sm text-zinc-600 space-y-1">
                                                {project.description.split("\n").map((line, i) => (
                                                    line.trim() && <li key={i}>{line}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </main>
            </div>
        </div>
    );
};

/* ── Small helper components ── */

const SidebarHeading = ({ children }: { children: React.ReactNode }) => (
    <h2 className="text-xs font-bold tracking-widest text-zinc-400 uppercase mb-3 border-b border-zinc-100 pb-1">
        {children}
    </h2>
);

const MainHeading = ({
    children,
    accentColor,
}: {
    children: React.ReactNode;
    accentColor: string;
}) => (
    <h2
        className="text-xs font-bold tracking-widest uppercase pb-1 border-b"
        style={{ color: accentColor, borderColor: accentColor + "40" }}
    >
        {children}
    </h2>
);

export default MinimalImageTemplate;