ALTER TABLE "blog_posts" ADD COLUMN "categories" jsonb DEFAULT '[]'::jsonb NOT NULL;

UPDATE "blog_posts"
SET "categories" = CASE
  WHEN "category" IS NOT NULL AND "category" <> '' THEN to_jsonb(ARRAY["category"])
  ELSE '[]'::jsonb
END;

ALTER TABLE "blog_posts" DROP COLUMN "category";
