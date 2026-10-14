CREATE TABLE "uploaded_images" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"data" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
