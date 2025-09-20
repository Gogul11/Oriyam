CREATE TABLE "users" (
	"user_id" varchar(255) PRIMARY KEY NOT NULL,
	"username" varchar(255) NOT NULL,
	"email" varchar(255),
	"mobile" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"age" integer NOT NULL,
	"goverment_id" varchar(255) NOT NULL,
	"dateofbirth" date NOT NULL,
	"photo" varchar(255) NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_mobile_unique" UNIQUE("mobile")
);
