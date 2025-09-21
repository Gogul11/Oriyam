CREATE TABLE "land" (
	"landId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" varchar(255) NOT NULL,
	"area" varchar(20) NOT NULL,
	"unit" varchar(255) NOT NULL,
	"rentPricePerMonth" numeric(8, 2) NOT NULL,
	"soilType" varchar(255) NOT NULL,
	"waterSource" varchar(255) NOT NULL,
	"availabilityFrom" date NOT NULL,
	"availabilityTo" date NOT NULL,
	"coordinates" varchar(255)[],
	"photos" varchar(255)[],
	"status" boolean DEFAULT true NOT NULL,
	"created_at" date NOT NULL,
	"updated_at" date NOT NULL
);
--> statement-breakpoint
CREATE TABLE "land review" (
	"land_review_id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"land_id" uuid NOT NULL,
	"review" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transaction" (
	"transaction_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"land_id" uuid NOT NULL,
	"buyer_id" uuid NOT NULL,
	"seller_id" uuid NOT NULL,
	"initial_deposit" numeric(8, 2) NOT NULL,
	"is_monthly_due_paid" boolean NOT NULL,
	"monthly_due" varchar(255) NOT NULL,
	"transaction_date" date NOT NULL,
	"start_date" varchar(255) NOT NULL,
	"end_date" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user review" (
	"user_review_id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"review" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"user_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"mobile" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"age" integer NOT NULL,
	"goverment_id" varchar(50) NOT NULL,
	"gov_id_type" varchar(50) NOT NULL,
	"dateofbirth" date NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_mobile_unique" UNIQUE("mobile"),
	CONSTRAINT "users_goverment_id_unique" UNIQUE("goverment_id")
);
--> statement-breakpoint
ALTER TABLE "land" ADD CONSTRAINT "land_userId_users_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "land review" ADD CONSTRAINT "land review_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "land review" ADD CONSTRAINT "land review_land_id_land_landId_fk" FOREIGN KEY ("land_id") REFERENCES "public"."land"("landId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_land_id_land_landId_fk" FOREIGN KEY ("land_id") REFERENCES "public"."land"("landId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_buyer_id_users_user_id_fk" FOREIGN KEY ("buyer_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_seller_id_users_user_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user review" ADD CONSTRAINT "user review_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;