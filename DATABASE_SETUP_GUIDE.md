# Database Setup Guide

## Quick Setup

The application requires three tables: `posts`, `categories`, and `posts_to_categories`.

## Option 1: Automatic Setup (Recommended)

If your database is accessible, use Drizzle Kit:

```bash
npx drizzle-kit push
```

## Option 2: Manual Setup

If you're experiencing connection issues, run the SQL script manually:

### Using psql Command Line

```bash
psql -h your-host -U your-username -d your-database -f database-setup.sql
```

Example:

```bash
psql -h coblog.xxx.rds.amazonaws.com -U postgres -d postgres -f database-setup.sql
```

### Using pgAdmin or Database GUI

1. Open your PostgreSQL client (pgAdmin, DBeaver, etc.)
2. Connect to your database
3. Open `database-setup.sql`
4. Execute the script

### Using AWS RDS Query Editor

1. Go to RDS console
2. Select your database
3. Click "Query Editor"
4. Paste the contents of `database-setup.sql`
5. Execute

## Verify Installation

After running the script, verify the tables were created:

```sql
-- List all tables
\dt

-- Check posts table
SELECT * FROM posts;

-- Check categories table
SELECT * FROM categories;

-- Check junction table
SELECT * FROM posts_to_categories;
```

You should see 2 sample posts and 3 categories if the script ran successfully.

## Troubleshooting

### Connection Timeout

If you get connection timeout errors:

1. Check security group rules (AWS RDS)
2. Ensure port 5432 is open
3. Verify your IP is whitelisted
4. Check VPC and subnet settings

### Permission Denied

Ensure your database user has CREATE privileges:

```sql
GRANT ALL PRIVILEGES ON DATABASE your_database TO your_user;
```

### Tables Already Exist

The script uses `IF NOT EXISTS` and `ON CONFLICT DO NOTHING`, so it's safe to run multiple times.

To start fresh:

```sql
DROP TABLE IF EXISTS posts_to_categories CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
```

Then run `database-setup.sql` again.

## Next Steps

After the database is set up:

1. Verify the `.env` file has the correct `DATABASE_URL`
2. Start the development server: `npm run dev`
3. Visit http://localhost:3000
4. Check the blog page: http://localhost:3000/blog
5. You should see the sample posts

## Database Schema Overview

```
posts
  ├── id (SERIAL PRIMARY KEY)
  ├── title (TEXT NOT NULL)
  ├── slug (TEXT UNIQUE NOT NULL)
  ├── content (TEXT NOT NULL)
  ├── excerpt (TEXT)
  ├── published (BOOLEAN DEFAULT false)
  ├── created_at (TIMESTAMP DEFAULT NOW())
  └── updated_at (TIMESTAMP DEFAULT NOW())

categories
  ├── id (SERIAL PRIMARY KEY)
  ├── name (TEXT NOT NULL)
  ├── slug (TEXT UNIQUE NOT NULL)
  ├── description (TEXT)
  ├── created_at (TIMESTAMP DEFAULT NOW())
  └── updated_at (TIMESTAMP DEFAULT NOW())

posts_to_categories
  ├── post_id (INT → posts.id CASCADE)
  ├── category_id (INT → categories.id CASCADE)
  └── PRIMARY KEY (post_id, category_id)
```

## Sample Data

The script includes:

**Categories:**

- Technology
- Lifestyle
- Travel

**Posts:**

- "Welcome to CoBlog" (published)
- "Getting Started with Next.js 15" (published)

Both posts are in the "Technology" category.
