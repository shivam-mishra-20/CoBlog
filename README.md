# CoBlog - Modern Blogging Platform

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![tRPC](https://img.shields.io/badge/tRPC-Latest-blue)](https://trpc.io/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

A modern, type-safe blogging platform built with Next.js 15, tRPC, PostgreSQL, and Drizzle ORM. Features full CRUD operations, category management, markdown support, and a beautiful responsive UI.

## ✨ Features

### Core Features

- ✅ **Complete Blog Post CRUD** - Create, read, update, and delete blog posts
- ✅ **Category Management** - Organize posts with multiple categories
- ✅ **Category Filtering** - Filter blog posts by category
- ✅ **Draft & Publish** - Control post visibility with publish status
- ✅ **Markdown Support** - Write content in Markdown with live rendering
- ✅ **SEO-Friendly URLs** - Automatic slug generation from titles
- ✅ **Responsive Design** - Mobile-first, works on all devices
- ✅ **Type-Safe API** - End-to-end type safety with tRPC

### UI Pages

- 🏠 **Landing Page** - Hero, features showcase, and footer
- 📝 **Blog Listing** - Grid view with category filters
- 📖 **Post Detail** - Full post view with markdown rendering
- 🎛️ **Dashboard** - Admin interface for managing posts
- 🏷️ **Categories** - Manage and organize categories

## 🛠️ Tech Stack

| Layer                | Technology                   |
| -------------------- | ---------------------------- |
| **Framework**        | Next.js 15 (App Router)      |
| **Language**         | TypeScript                   |
| **Database**         | PostgreSQL                   |
| **ORM**              | Drizzle ORM                  |
| **API**              | tRPC (type-safe RPC)         |
| **Validation**       | Zod                          |
| **Data Fetching**    | TanStack Query (React Query) |
| **State Management** | Zustand                      |
| **Styling**          | Tailwind CSS                 |
| **Content**          | Markdown (react-markdown)    |

## 🚀 Quick Start

### Prerequisites

- Node.js 18 or higher
- PostgreSQL database (local or hosted)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd coblog
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```env
   DATABASE_URL=postgresql://username:password@host:port/database
   ```

   Examples:

   ```env
   # Local PostgreSQL
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/coblog

   # Neon
   DATABASE_URL=postgresql://user:pass@ep-xxx.region.aws.neon.tech/coblog

   # Supabase
   DATABASE_URL=postgresql://postgres:pass@db.xxx.supabase.co:5432/postgres

   # AWS RDS
   DATABASE_URL=postgresql://postgres:pass@xxx.rds.amazonaws.com:5432/postgres
   ```

4. **Initialize the database**

   Run the SQL script in your PostgreSQL database:

   ```bash
   psql -h your-host -U your-user -d your-database -f database-setup.sql
   ```

   Or use Drizzle Kit (if connection is working):

   ```bash
   npx drizzle-kit push
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
coblog/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── page.tsx             # Landing page
│   │   ├── layout.tsx           # Root layout
│   │   ├── api/trpc/[trpc]/    # tRPC API endpoint
│   │   ├── blog/                # Blog pages
│   │   ├── dashboard/           # Admin dashboard
│   │   └── categories/          # Category management
│   ├── components/              # React components
│   │   ├── Navigation.tsx       # Site navigation
│   │   ├── PostModal.tsx        # Post editor modal
│   │   └── CategoryModal.tsx    # Category editor modal
│   ├── lib/                     # Utilities
│   │   ├── trpc/               # tRPC client/server setup
│   │   └── store/              # Zustand stores
│   └── server/                  # Backend code
│       ├── db/                  # Database
│       │   ├── schema.ts        # Drizzle schema
│       │   └── index.ts         # DB connection
│       ├── trpc/                # tRPC configuration
│       │   ├── trpc.ts          # tRPC setup
│       │   ├── context.ts       # Request context
│       │   └── routers/         # API routers
│       └── utils/               # Server utilities
├── database-setup.sql           # Database initialization
├── drizzle.config.ts            # Drizzle configuration
├── package.json                 # Dependencies
└── .env                         # Environment variables
```

## 🔌 API Reference

### Post Routes

```typescript
// Get all posts (with optional filters)
trpc.post.getAll.useQuery({
  categoryId?: number,
  published?: boolean
})

// Get post by slug
trpc.post.getBySlug.useQuery({ slug: string })

// Get post by ID
trpc.post.getById.useQuery({ id: number })

// Create post
trpc.post.create.useMutation({
  title: string
  content: string
  excerpt?: string
  published: boolean
  categoryIds: number[]
})

// Update post
trpc.post.update.useMutation({
  id: number
  title?: string
  content?: string
  excerpt?: string
  published?: boolean
  categoryIds?: number[]
})

// Delete post
trpc.post.delete.useMutation({ id: number })
```

### Category Routes

```typescript
// Get all categories with post counts
trpc.category.getAll.useQuery()

// Get category by ID
trpc.category.getById.useQuery({ id: number })

// Get category by slug
trpc.category.getBySlug.useQuery({ slug: string })

// Create category
trpc.category.create.useMutation({
  name: string
  description?: string
})

// Update category
trpc.category.update.useMutation({
  id: number
  name?: string
  description?: string
})

// Delete category
trpc.category.delete.useMutation({ id: number })
```

## 📝 Usage Guide

### Creating a Blog Post

1. Navigate to **Dashboard** (`/dashboard`)
2. Click **"Create New Post"**
3. Fill in:
   - **Title** (required) - Slug auto-generated
   - **Content** (required) - Markdown supported
   - **Excerpt** (optional) - Brief description
   - **Categories** - Select multiple
   - **Published** - Check to make visible
4. Click **"Create Post"**

### Managing Categories

1. Go to **Categories** (`/categories`)
2. Click **"Add Category"**
3. Enter name and optional description
4. Click **"Create Category"**

### Viewing Posts

- **All Posts**: `/blog`
- **Filter by Category**: Click category buttons
- **Individual Post**: Click any post card
- **Published Only**: Only published posts visible to readers

## 🎨 Customization

### Styling

Edit Tailwind classes in components:

```tsx
// Change primary color from blue to purple
className="bg-blue-600" → className="bg-purple-600"
```

### Database Schema

Modify `src/server/db/schema.ts` and run:

```bash
npx drizzle-kit push
```

### Adding New Features

1. Create router in `src/server/trpc/routers/`
2. Add to root router in `src/server/trpc/routers/index.ts`
3. Use in components with `trpc.yourRouter.procedure.useQuery()`

## 📊 Scripts

```bash
# Development
npm run dev          # Start dev server with Turbopack

# Production
npm run build        # Build for production
npm start            # Start production server

# Database
npm run db:generate  # Generate migrations
npm run db:push      # Push schema to database
npm run db:studio    # Open Drizzle Studio

# Code Quality
npm run lint         # Run ESLint
```

## 🔒 Security Notes

**⚠️ Important**: This application **does not include authentication**.

For production deployment:

1. **Add Authentication**

   - NextAuth.js, Clerk, or Auth0
   - Protect dashboard and categories routes

2. **Implement Authorization**

   - Add user roles (admin, editor, viewer)
   - Validate ownership in tRPC procedures

3. **Security Best Practices**

   - Enable HTTPS
   - Add rate limiting
   - Sanitize user inputs
   - Use environment variables for secrets
   - Enable CORS restrictions

4. **Database Security**
   - Use connection pooling
   - Enable SSL for database connections
   - Regular backups
   - Apply least privilege principle

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variable:
   - `DATABASE_URL`: Your PostgreSQL connection string
4. Deploy

### Docker

```bash
# Build image
docker build -t coblog .

# Run container
docker run -p 3000:3000 -e DATABASE_URL="your-db-url" coblog
```

### Traditional Hosting

1. Build the application: `npm run build`
2. Set `DATABASE_URL` environment variable
3. Start server: `npm start`
4. Ensure Node.js 18+ is installed

## 🐛 Troubleshooting

### Database Connection Issues

```bash
# Test connection
psql "postgresql://user:pass@host:port/db"

# Check firewall rules
# Ensure port 5432 is open

# Verify .env file
cat .env
```

### Build Errors

```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run dev
```

### Type Errors

```bash
# Regenerate types
npm run build
```

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [tRPC Documentation](https://trpc.io/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team)
- [TanStack Query Documentation](https://tanstack.com/query)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👏 Acknowledgments

Built with modern web technologies:

- Next.js team for the amazing framework
- tRPC team for type-safe APIs
- Drizzle team for the excellent ORM
- Vercel for hosting platform

---

**Made with ❤️ using Next.js 15, tRPC, and PostgreSQL**

For questions or issues, please open an issue on GitHub.
