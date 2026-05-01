import {
    integer,
    pgEnum,
    pgTable,
    timestamp,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";
import { usersTable } from "./userSchema";

export const subscriptionPlanEnum = pgEnum("subscrption_plans", [
    "MONTHLY",
    "YEARLY",
]);

export const subscriptionPricingEnum = pgEnum("subscription_pricing", [
    "RECOMMENDED",
    "ENTERPRISE",
]);

export const subscriptionStatusEnum = pgEnum("subscription_status", [
    "ACTIVE",
    "EXPIRED",
    "CANCELLED",
]);

export const subscriptionTable = pgTable("subscriptions", {
    // Identity
    id: integer().notNull().generatedAlwaysAsIdentity(),
    uuid: uuid("uuuid").defaultRandom().notNull().unique(),
    userId: integer("userId")
        .notNull()
        .references(() => usersTable.id, { onDelete: "cascade" }),

    // Subscription
    plan: subscriptionPlanEnum("plan").notNull(),
    pricing: subscriptionPricingEnum("pricing").notNull(),
    status: subscriptionStatusEnum("status").notNull(),
    amount: integer("amount").notNull(),

    // Razorpay credentials
    razorpayOrderId: varchar("razorpay_order_id", { length: 255 }),
    razorpayPaymentId: varchar("razorpay_payment_id", { length: 255 }),
    razorpaySignatureId: varchar("razorpay_signature_id", { length: 255 }),

    // Audit
    startDate: timestamp("start_date", {
        withTimezone: true,
        mode: "date",
    }).notNull(),

    endDate: timestamp("end_date", {
        withTimezone: true,
        mode: "date",
    }).notNull(),

    updatedAt: timestamp("updated_at", {
        withTimezone: true,
        mode: "date",
    }).defaultNow(),

    createdAt: timestamp("created_at", {
        withTimezone: true,
        mode: "date",
    }).defaultNow(),
});
