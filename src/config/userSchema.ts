import {
    boolean,
    integer,
    pgTable,
    timestamp,
    uuid,
    varchar,
    index,
    pgEnum,
} from "drizzle-orm/pg-core";

export const subscriptionPricingEnum = pgEnum("pricing", [
    "FREE",
    "RECOMMENDED",
    "ENTERPRISE",
]);

export const usersTable = pgTable("users", {
    // ID
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    uuid: uuid("uuid").defaultRandom().notNull().unique(),

    // Personal Details
    fullName: varchar("fullName", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    profilePhoto: varchar("profilePhoto", { length: 500 }),

    // Google Id (fix typo)
    googleId: varchar("googleId", { length: 500 }),

    // Password hash (nullable for OAuth users)
    passwordHash: varchar("passwordHash", { length: 255 }),

    // Subscription
    credits: integer("credits").notNull().default(2),
    isSubscribed: boolean("isSubscribed").default(false),
    pricing: subscriptionPricingEnum("pricing").default("FREE"),

    // AI Usage Tracking (VERY important for SaaS)
    tokensRemaining: integer("tokensRemaining").default(0),
    atsScoreChecks: integer("atsScoreChecks").default(0),
    jobDescriptionMatchings: integer("jobDescriptionMatchings").default(0),
    coverLetterGenerations: integer("coverLetterGenerations").default(0),

    // Email Verification
    emailVerified: boolean("emailVerified").default(false),
    emailVerificationOtp: varchar("emailVerificationOtp", { length: 6 }),
    emailVerificationExpires: timestamp("emailVerificationExpires", {
        withTimezone: true,
    }),

    // Auth Tokens
    activationToken: varchar("activationToken", { length: 255 }),
    activationTokenExpires: timestamp("activationTokenExpires", {
        withTimezone: true,
    }),

    forgotPasswordToken: varchar("forgotPasswordToken", { length: 255 }),
    forgotPasswordExpires: timestamp("forgotPasswordExpires", {
        withTimezone: true,
    }),

    resetPasswordToken: varchar("resetPasswordToken", { length: 255 }),
    resetPasswordExpires: timestamp("resetPasswordExpires", {
        withTimezone: true,
    }),

    // Audit
    updatedAt: timestamp("updatedAt", {
        withTimezone: true,
    }).defaultNow(),

    createdAt: timestamp("createdAt", {
        withTimezone: true,
    }).defaultNow(),
}, (table) => {
    return {
        emailIdx: index("email_idx").on(table.email),
        uuidIdx: index("uuid_idx").on(table.uuid),
    };
});