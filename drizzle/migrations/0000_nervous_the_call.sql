DO $$ BEGIN
 CREATE TYPE "stage" AS ENUM('IDEA', 'PLAN', 'DEVELOPMENT', 'FINISHED', 'PRODUCTION');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "account" (
	"userId" uuid NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "project" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text DEFAULT 'A project',
	"image" text,
	"stage" "stage" NOT NULL,
	"authorID" uuid NOT NULL,
	"github_url" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" uuid NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text,
	"own_projects" uuid[],
	"projects" uuid[],
	"email" varchar(191) NOT NULL,
	"emailVerified" timestamp,
	"image" varchar(191),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "verificationToken" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verificationToken_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "accounts__provider__providerAccountId__idx" ON "account" ("provider","providerAccountId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "accounts__userId__idx" ON "account" ("userId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "sessions__sessionToken__idx" ON "session" ("sessionToken");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sessions__userId__idx" ON "session" ("userId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "users__email__idx" ON "user" ("email");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
