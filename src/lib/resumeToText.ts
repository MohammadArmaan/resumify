import { ResumeData } from "@/types/resume-types";

export function resumeToText(resume: ResumeData) {
    return `
Summary:
${resume.professionalSummary || ""}

Skills:
${resume.skills?.join(", ") || ""}

Experience:
${resume.experience
    ?.map(
        (e) =>
            `${e.position} at ${e.company} (${e.startDate} - ${
                e.isCurrent ? "Present" : e.endDate
            }): ${e.description}`
    )
    .join("\n") || ""}

Projects:
${resume.project
    ?.map((p) => `${p.name}: ${p.description}`)
    .join("\n") || ""}
`;
}