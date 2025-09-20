CREATE TABLE "land" (
	"land_id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"coordinates" varchar(255) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" varchar(255) NOT NULL,
	"area" varchar(20) NOT NULL,
	"unit" varchar(255) NOT NULL,
	"location" varchar(255) NOT NULL,
	"latitude" numeric(8, 2) NOT NULL,
	"longitude" numeric(8, 2) NOT NULL,
	"soil_type" varchar(255) NOT NULL,
	"water_source" varchar(255) NOT NULL,
	"availability_from" date NOT NULL,
	"availability_to" date NOT NULL,
	"rent_price_per_month" numeric(8, 2) NOT NULL,
	"status" boolean NOT NULL,
	"created_at" date NOT NULL,
	"updated_at" date NOT NULL,
	CONSTRAINT "land_coordinates_unique" UNIQUE("coordinates")
);
--> statement-breakpoint
CREATE TABLE "land review" (
	"land_review_id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"land_id" varchar(255) NOT NULL,
	"review" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transaction" (
	"transaction_id" varchar(255) PRIMARY KEY NOT NULL,
	"land_id" varchar(255) NOT NULL,
	"buyer_id" varchar(255) NOT NULL,
	"seller_id" varchar(255) NOT NULL,
	"initial_deposit" numeric(8, 2) NOT NULL,
	"is_monthly_due_paid" boolean NOT NULL,
	"monthly_due" varchar(255) NOT NULL,
	"transaction_date" date NOT NULL,
	"start_date" varchar(255) NOT NULL,
	"end_date" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user review" (
	"user_review_id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"review" varchar(255) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "goverment_id" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "created_at" date NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "updated_at" date NOT NULL;--> statement-breakpoint
ALTER TABLE "land" ADD CONSTRAINT "land_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "land review" ADD CONSTRAINT "land review_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "land review" ADD CONSTRAINT "land review_land_id_land_land_id_fk" FOREIGN KEY ("land_id") REFERENCES "public"."land"("land_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_land_id_land_land_id_fk" FOREIGN KEY ("land_id") REFERENCES "public"."land"("land_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_buyer_id_users_user_id_fk" FOREIGN KEY ("buyer_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_seller_id_users_user_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user review" ADD CONSTRAINT "user review_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "photo";--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_goverment_id_unique" UNIQUE("goverment_id");