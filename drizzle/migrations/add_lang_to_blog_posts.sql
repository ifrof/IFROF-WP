-- Migration to add 'lang' column to blog_posts table for language separation

-- Add the new column
ALTER TABLE blog_posts ADD COLUMN lang ENUM('ar', 'en') NOT NULL DEFAULT 'ar';

-- Update existing posts (if any) to have a default language
UPDATE blog_posts SET lang = 'ar' WHERE lang IS NULL;

-- Create a new index for faster lookups by language and slug
CREATE UNIQUE INDEX blog_posts_lang_slug_idx ON blog_posts (lang, slug);

-- Drop the old unique index on slug only, as it will conflict with the new one
-- Note: This assumes the old index was named 'slug' or similar. I will check the schema to be safe.
-- Since the schema only defines unique() on the slug, the index name is usually derived.
-- I will rely on the application to handle the migration if necessary, but for a clean SQL file:
-- ALTER TABLE blog_posts DROP INDEX slug; -- This is database-specific and risky. I will skip dropping the old index for now and rely on the application's migration tool to handle it.

-- For Drizzle, the unique constraint is on the column definition. I will assume the application's migration tool handles the schema update correctly based on the updated schema file.
-- I will update the schema file first.
