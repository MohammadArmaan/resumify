export type PersonalInfoData = {
    fullName: string;
    email: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    github?: string;
    website?: string;
    profession?: string;
    image?: string;
};

export type ExperienceData = {
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
    isCurrent: boolean;
    id: string;
};

export type EducationData = {
    institution: string;
    degree: string;
    field: string;
    graduationDate: string;
    gpa: string;
    id: string;
};

export type ProjectData = {
    name: string;
    type: string;
    description: string;
    id: string;
};

export type ResumeTemplate =
    | "modern"
    | "minimal"
    | "minimal-image"
    | "classic"
    | "premium"
    | "executive";

export type ResumeData = {
    personalInfo: {
        fullName: string;
        email: string;
        phone?: string;
        location?: string;
        linkedin?: string;
        github?: string;
        website?: string;
        profession?: string;
        image?: string;
    };
    id: number;
    uuid: string
    userId: string;
    title: string;
    public: boolean;
    professionalSummary?: string;
    skills?: string[];
    experience?: {
        company: string;
        position: string;
        startDate: string;
        endDate: string;
        description: string;
        isCurrent: boolean;
        id: string;
    }[];
    education?: {
        institution: string;
        degree: string;
        field: string;
        graduationDate: string;
        gpa: string;
        id: string;
    }[];
    template: string;
    accentColor: string;
    project?: {
        name: string;
        type: string;
        description: string;
        id: string;
    }[];
    updatedAt: string;
    createdAt: string;
};

export type ResumeList = ResumeData[]; // use this where you need the array
