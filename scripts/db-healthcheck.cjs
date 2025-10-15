// Simple database health check script.
// Usage: `npm run db:health`
// Ensures DATABASE_URL is reachable and required tables exist.

import postgres from 'postgres';

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL environment variable is not set');
  process.exit(1);
}

const sql = postgres(process.env.DATABASE_URL, { max_lifetime: 30 * 1000 });

async function main() {
  try {
    // List tables in public schema
    const tables = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `;

    console.log('Existing tables:', tables.map(t => t.table_name));

    // Check if core tables exist
    const required = ['posts', 'categories', 'posts_to_categories'];
    const missing = required.filter(r => !tables.find(t => t.table_name === r));
    if (missing.length) {
      console.warn('Missing tables:', missing);
    } else {
      console.log('All required tables present.');
    }

    // Try a simple count on posts (if exists)
    if (!missing.includes('posts')) {
      const [{ count }] = await sql`SELECT COUNT(*)::int AS count FROM posts;`;
      console.log(`Posts count: ${count}`);
    }

    // Try a simple count on categories (if exists)
    if (!missing.includes('categories')) {
      const [{ count }] = await sql`SELECT COUNT(*)::int AS count FROM categories;`;
      console.log(`Categories count: ${count}`);
    }

    await sql.end({ timeout: 5 });
  } catch (err) {
    console.error('Healthcheck failed:', err.message);
    if (err.stack) console.error(err.stack);
    process.exit(1);
  }
}

main();
