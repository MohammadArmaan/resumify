// db/schema/resume-schema.ts

import {
    pgTable,
    serial,
    varchar,
    text,
    boolean,
    timestamp,
    jsonb,
    integer,
    index,
    uniqueIndex,
} from "drizzle-orm/pg-core";
import { usersTable } from "./userSchema";

export const resumesTable = pgTable(
    "resumes",
    {
        id: serial("id").primaryKey(),

        uuid: varchar("uuid", { length: 255 }).notNull(),

        userId: integer("user_id")
            .notNull()
            .references(() => usersTable.id, { onDelete: "cascade" }),

        title: varchar("title", { length: 255 }).notNull(),

        public: boolean("public").notNull().default(false),

        personalInfo: jsonb("personal_info")
            .$type<{
                fullName: string;
                email: string;
                phone?: string;
                location?: string;
                linkedin?: string;
                github?: string;
                website?: string;
                profession?: string;
                image?: string;
            }>()
            .notNull(),

        professionalSummary: text("professional_summary"),

        skills: jsonb("skills").$type<string[]>().default([]),

        experience: jsonb("experience")
            .$type<
                {
                    company: string;
                    position: string;
                    startDate: string;
                    endDate: string;
                    description: string;
                    isCurrent: boolean;
                    id: string;
                }[]
            >()
            .default([]),

        education: jsonb("education")
            .$type<
                {
                    institution: string;
                    degree: string;
                    field: string;
                    graduationDate: string;
                    gpa: string;
                    id: string;
                }[]
            >()
            .default([]),

        project: jsonb("project")
            .$type<
                {
                    name: string;
                    type: string;
                    description: string;
                    id: string;
                }[]
            >()
            .default([]),

        template: varchar("template", { length: 50 })
            .$type<
                | "modern"
                | "minimal"
                | "minimal-image"
                | "classic"
                | "premium"
                | "executive"
            >()
            .notNull()
            .default("modern"),

        accentColor: varchar("accent_color", { length: 30 })
            .notNull()
            .default("#2563eb"),

        createdAt: timestamp("created_at", {
            withTimezone: true,
            mode: "date",
        })
            .notNull()
            .defaultNow(),

        updatedAt: timestamp("updated_at", {
            withTimezone: true,
            mode: "date",
        })
            .notNull()
            .defaultNow(),
    },
    (table) => ({
        uuidUnique: uniqueIndex("resumes_uuid_unique").on(table.uuid),

        userIdIdx: index("resumes_user_id_idx").on(table.userId),

        userUpdatedIdx: index("resumes_user_updated_idx").on(
            table.userId,
            table.updatedAt
        ),
    })
);