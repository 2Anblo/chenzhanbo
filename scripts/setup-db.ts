import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

async function main() {
  console.log('Creating tables...');

  await sql`
    CREATE TABLE IF NOT EXISTS blog_posts (
      id VARCHAR(255) PRIMARY KEY,
      slug VARCHAR(255) UNIQUE NOT NULL,
      title VARCHAR(255) NOT NULL,
      excerpt TEXT NOT NULL DEFAULT '',
      content TEXT NOT NULL,
      category VARCHAR(100) NOT NULL DEFAULT '',
      tags JSONB NOT NULL DEFAULT '[]',
      published_at VARCHAR(50) NOT NULL DEFAULT '',
      reading_time INTEGER NOT NULL DEFAULT 0,
      cover VARCHAR(500),
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS projects (
      id VARCHAR(255) PRIMARY KEY,
      slug VARCHAR(255) UNIQUE NOT NULL,
      title VARCHAR(255) NOT NULL,
      subtitle VARCHAR(255) NOT NULL DEFAULT '',
      description TEXT NOT NULL DEFAULT '',
      background TEXT NOT NULL DEFAULT '',
      content TEXT NOT NULL,
      tech_stack JSONB NOT NULL DEFAULT '[]',
      contributions JSONB NOT NULL DEFAULT '[]',
      highlights JSONB NOT NULL DEFAULT '[]',
      github_url VARCHAR(500) NOT NULL DEFAULT '',
      demo_url VARCHAR(500),
      category VARCHAR(100) NOT NULL DEFAULT 'personal',
      date VARCHAR(50),
      image VARCHAR(500),
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  console.log('Tables created successfully!');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
