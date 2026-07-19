import { pgTable, varchar, text, integer, timestamp, jsonb } from 'drizzle-orm/pg-core';

export const blogPosts = pgTable('blog_posts', {
  id: varchar('id', { length: 255 }).primaryKey(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  title: varchar('title', { length: 255 }).notNull(),
  excerpt: text('excerpt').notNull().default(''),
  content: text('content').notNull(),
  category: varchar('category', { length: 100 }).notNull().default(''),
  tags: jsonb('tags').$type<string[]>().notNull().default([]),
  publishedAt: varchar('published_at', { length: 50 }).notNull().default(''),
  readingTime: integer('reading_time').notNull().default(0),
  cover: varchar('cover', { length: 500 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const projects = pgTable('projects', {
  id: varchar('id', { length: 255 }).primaryKey(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  title: varchar('title', { length: 255 }).notNull(),
  subtitle: varchar('subtitle', { length: 255 }).notNull().default(''),
  description: text('description').notNull().default(''),
  background: text('background').notNull().default(''),
  content: text('content').notNull(),
  techStack: jsonb('tech_stack').$type<string[]>().notNull().default([]),
  contributions: jsonb('contributions').$type<string[]>().notNull().default([]),
  highlights: jsonb('highlights').$type<string[]>().notNull().default([]),
  githubUrl: varchar('github_url', { length: 500 }).notNull().default(''),
  demoUrl: varchar('demo_url', { length: 500 }),
  category: varchar('category', { length: 100 }).notNull().default('personal'),
  date: varchar('date', { length: 50 }),
  image: varchar('image', { length: 500 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});
