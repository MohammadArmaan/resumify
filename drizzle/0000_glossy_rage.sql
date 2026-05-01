CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"fullName" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"profilePhoto" varchar(500),
	"googleId" varchar(500),
	"passwordHash" varchar(255),
	"credits" integer DEFAULT 2 NOT NULL,
	"isSubscribed" boolean DEFAULT false,
	"tokensUsed" integer DEFAULT 0,
	"atsScoreChecks" integer DEFAULT 0,
	"jobDescriptionMatchings" integer DEFAULT 0,
	"coverLetterGenerations" integer DEFAULT 0,
	"emailVerified" boolean DEFAULT false,
	"emailVerificationOtp" varchar(6),
	"emailVerificationExpires" timestamp with time zone,
	"activationToken" varchar(255),
	"activationTokenExpires" timestamp with time zone,
	"forgotPasswordToken" varchar(255),
	"forgotPasswordExpires" timestamp with time zone,
	"resetPasswordToken" varchar(255),
	"resetPasswordExpires" timestamp with time zone,
	"updatedAt" timestamp with time zone DEFAULT now(),
	"createdAt" timestamp with time zone DEFAULT now(),
	CONSTRAINT "users_uuid_unique" UNIQUE("uuid"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE INDEX "email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "uuid_idx" ON "users" USING btree ("uuid");