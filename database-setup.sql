-- CoBlog Database Schema
-- Run this SQL script in your PostgreSQL database to create the tables

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content TEXT NOT NULL,
    excerpt TEXT,
    published BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create posts_to_categories junction table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS posts_to_categories (
    post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, category_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- Insert sample data (optional)
INSERT INTO categories (name, slug, description) VALUES
    ('Technology', 'technology', 'Articles about technology and programming'),
    ('Lifestyle', 'lifestyle', 'Lifestyle and personal development'),
    ('Travel', 'travel', 'Travel stories and guides')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO posts (title, slug, content, excerpt, published) VALUES
    ('Welcome to CoBlog', 'welcome-to-coblog', '# Welcome to CoBlog\n\nThis is your first blog post! CoBlog is a modern blogging platform built with Next.js 15, tRPC, and PostgreSQL.\n\n## Features\n\n- **Type-Safe API** with tRPC\n- **Markdown Support** for rich content\n- **Category Management** to organize posts\n- **Draft & Publish** workflow\n\nGet started by creating your own posts in the dashboard!', 'Your first blog post on CoBlog platform', true),
    ('Getting Started with Next.js 15', 'getting-started-nextjs-15', '# Getting Started with Next.js 15\n\nNext.js 15 brings exciting new features and improvements.\n\n## Key Features\n\n1. **Turbopack**: Faster builds\n2. **App Router**: Modern routing\n3. **Server Components**: Better performance\n\nStart building amazing web applications today!', 'Learn about Next.js 15 new features', true)
ON CONFLICT (slug) DO NOTHING;

-- Link posts to categories
INSERT INTO posts_to_categories (post_id, category_id)
SELECT p.id, c.id
FROM posts p, categories c
WHERE p.slug = 'welcome-to-coblog' AND c.slug = 'technology'
ON CONFLICT DO NOTHING;

INSERT INTO posts_to_categories (post_id, category_id)
SELECT p.id, c.id
FROM posts p, categories c
WHERE p.slug = 'getting-started-nextjs-15' AND c.slug = 'technology'
ON CONFLICT DO NOTHING;
