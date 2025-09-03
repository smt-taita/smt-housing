CREATE TABLE "campaign_data" (
	"id" varchar PRIMARY KEY DEFAULT 'main' NOT NULL,
	"goal" numeric(10, 2) DEFAULT '24000' NOT NULL,
	"currency" text DEFAULT 'NZD' NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"total_raised" numeric(10, 2) DEFAULT '0',
	"online_total" numeric(10, 2) DEFAULT '0',
	"offline_total" numeric(10, 2) DEFAULT '0',
	"donor_count" integer DEFAULT 0,
	"monthly_commitments" numeric(10, 2) DEFAULT '0',
	"last_updated" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "donations" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"frequency" text NOT NULL,
	"source" text NOT NULL,
	"donor_name" text,
	"donor_email" text,
	"donor_phone" text,
	"message" text,
	"anonymous" boolean DEFAULT false,
	"receive_updates" boolean DEFAULT true,
	"date_received" timestamp DEFAULT now(),
	"notes" text,
	"created_at" timestamp DEFAULT now()
);
