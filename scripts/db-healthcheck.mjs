// Simple database health check script.
// Usage: `npm run db:health`
// Ensures DATABASE_URL is reachable and required tables/columns exist.

import 'dotenv/config';
import postgres from 'postgres';

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL environment variable is not set');
  process.exit(1);
}

// postgres-js expects seconds for max_lifetime; keep connections short-lived during healthcheck
const sql = postgres(process.env.DATABASE_URL, { max_lifetime: 30 });

async function main() {
  try {
    const tables = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `;

  console.log('Existing tables:', tables.map(t => t.table_name));

    const required = ['posts', 'categories', 'posts_to_categories'];
    const missing = required.filter(r => !tables.find(t => t.table_name === r));
    if (missing.length) {
      console.warn('Missing tables:', missing);
    } else {
      console.log('All required tables present.');
    }

    if (!missing.includes('posts')) {
      const [{ count }] = await sql`SELECT COUNT(*)::int AS count FROM posts;`;
      console.log(`Posts count: ${count}`);

      // Verify featured_image column exists on posts
      const featureCol = await sql`
        SELECT column_name
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'posts' AND column_name = 'featured_image';
      `;
      if (featureCol.length) {
        console.log("Column 'featured_image' exists on 'posts' ✅");
      } else {
        console.warn("Column 'featured_image' is MISSING on 'posts' ❌");
      }
    }
    if (!missing.includes('categories')) {
      const [{ count }] = await sql`SELECT COUNT(*)::int AS count FROM categories;`;
      console.log(`Categories count: ${count}`);
    }

    await sql.end({ timeout: 5 });
  } catch (err) {
  console.error('Healthcheck failed:', (err instanceof Error ? err.message : String(err)));
    if (err instanceof Error && err.stack) {
  console.error(err.stack);
    }
    process.exit(1);
  }
}

main();
