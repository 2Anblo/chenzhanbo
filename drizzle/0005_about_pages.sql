CREATE TABLE "about_pages" (
	"id" varchar(32) PRIMARY KEY NOT NULL,
	"content" jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now()
);
