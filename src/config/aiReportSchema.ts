// config/aiReportsSchema.ts

import {
    pgTable,
    uuid,
    integer,
    text,
    jsonb,
    timestamp,
    varchar,
} from "drizzle-orm/pg-core";
import { usersTable } from "./userSchema";

export const aiReportsTable = pgTable("ai_reports", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),

    uuid: uuid("uuid").defaultRandom().notNull().unique(),

    userId: integer("user_id")
        .notNull()
        .references(() => usersTable.id, { onDelete: "cascade" }),

    title: varchar("title", { length: 255 }).notNull(),
    

    // "ATS" | "JOB_MATCH" | "COVER_LETTER"
    type: text("type").notNull(),

    // INPUTS (based on your hook types)
    jobDescription: text("job_description"),
    company: text("company"),
    role: text("role"),
    resumeSnapshot: text("resume_snapshot").notNull(),

    // OUTPUT (typed per feature)
    result: jsonb("result").notNull(),

    // optional (if you later export PDF)
    pdfUrl: text("pdf_url"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});