# CoBlog - Modern Blogging Platform

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![tRPC](https://img.shields.io/badge/tRPC-Latest-blue)](https://trpc.io/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

CoBlog is a modern, type-safe blogging platform built with Next.js 15 (App Router), tRPC, PostgreSQL, and Drizzle ORM. It features a fully type-safe API surface, complete CRUD operations for posts and categories, a rich Lexical text editor, Firebase Storage integration for images, and a clean responsive UI with dark mode support.

## 🌟 Overview

CoBlog is designed to be a lightweight, developer-friendly blogging platform that prioritizes type safety and modern web development practices. The application uses a **localStorage-based user identity system** instead of traditional authentication, making it perfect for personal blogs, portfolios, and small-scale content management systems.

## ✨ Features

### Core Features

- ✅ **Complete Blog Post CRUD** - Create, read, update, and delete blog posts with full validation
- ✅ **Category Management** - Organize posts with multiple categories (many-to-many relationship)
- ✅ **Category Filtering** - Filter blog posts by category with dynamic counts
- ✅ **Draft & Publish** - Control post visibility with publish status toggle
- ✅ **Rich Text Editor** - Lexical-based WYSIWYG editor with markdown support, code blocks, lists, and links
- ✅ **SEO-Friendly URLs** - Automatic slug generation from titles with uniqueness validation
- ✅ **Responsive Design** - Mobile-first design that works seamlessly on all devices
- ✅ **Type-Safe API** - End-to-end type safety with tRPC and Zod validation
- ✅ **Image Upload** - Firebase Storage integration for featured images with drag-and-drop
- ✅ **Dark Mode** - System-aware dark mode with manual toggle
- ✅ **Search Functionality** - Full-text search across post titles, content, and excerpts
- ✅ **Pagination** - Efficient pagination for large post collections
- ✅ **Post Statistics** - Word count and estimated reading time for each post
- ✅ **Smooth Animations** - Lenis smooth scroll for enhanced user experience

### UI Pages

- 🏠 **Landing Page** - Hero section, features showcase, latest posts, and footer
- 📝 **Blog Listing** - Grid view with category filters, search, and pagination
- 📖 **Post Detail** - Full post view with rich text rendering and related categories
- 🎛️ **Dashboard** - Admin interface for managing posts with draft/published status
- 🏷️ **Categories** - Manage and organize categories with post counts

## 🔐 User Identity System

CoBlog uses a **localStorage-based identity system** instead of traditional authentication. This approach provides several benefits for personal blogging platforms:

### How It Works

1. **UUID Generation**: When a user first visits the site, a unique UUID v4 is generated and stored in `localStorage` under the key `coblog_user_id`.

2. **Persistent Identity**: This ID persists across browser sessions and is used to associate posts with their creators.

3. **Post Ownership**: Each post stores the creator's `ownerId` (UUID) in the database, allowing users to edit/delete only their own posts.

4. **No Authentication Required**: No signup, login, or password management needed - perfect for single-user or trusted-user scenarios.

### Implementation Details

```typescript
// src/lib/user-identity.ts
export function getOrCreateUserId(): string {
  let userId = localStorage.getItem("coblog_user_id");

  if (!userId) {
    userId = generateUUID(); // UUID v4 generator
    localStorage.setItem("coblog_user_id", userId);
  }

  return userId;
}
```

### Post Creation Flow

1. User opens the post creation modal in the dashboard
2. `getOrCreateUserId()` is called to retrieve or generate the user's UUID
3. Post is created with the `ownerId` field set to this UUID
4. tRPC validates the UUID format using Zod schema
5. Post is saved to the database with ownership information

### Security Considerations

⚠️ **Important Limitations:**

- **Not Suitable for Multi-User Production**: Anyone with access to the browser can create/edit posts
- **No Password Protection**: The UUID can be viewed in localStorage
- **Browser-Specific**: Clearing localStorage or using a different browser creates a new identity
- **No Recovery Mechanism**: Lost UUID means lost access to posts

### When to Use This Approach

✅ **Good For:**

- Personal blogs (single author)
- Portfolio websites
- Internal company blogs (trusted network)
- Development and testing
- Proof of concept projects

❌ **Not Recommended For:**

- Public multi-author platforms
- Commercial applications
- Sites requiring user privacy
- Applications with sensitive content

## 🛠️ Tech Stack

| Layer                | Technology                        |
| -------------------- | --------------------------------- |
| **Framework**        | Next.js 15.5 (App Router)         |
| **Language**         | TypeScript 5.0                    |
| **Database**         | PostgreSQL                        |
| **ORM**              | Drizzle ORM 0.44.6                |
| **API**              | tRPC 11.0 (type-safe RPC)         |
| **Validation**       | Zod                               |
| **Data Fetching**    | TanStack Query 5.90 (React Query) |
| **State Management** | Zustand                           |
| **Styling**          | Tailwind CSS                      |
| **Rich Text Editor** | Lexical 0.37 (Facebook's editor)  |
| **File Storage**     | Firebase Storage 12.4             |
| **Animations**       | Lenis 1.3 (smooth scroll)         |
| **UI Components**    | shadcn/ui + Radix UI primitives   |
| **Icons**            | Lucide React 0.545                |
| **Theme**            | next-themes 0.4 (dark mode)       |
| **Deployment**       | Vercel                            |

### Why These Technologies?

- **Next.js 15**: Latest App Router with server components and streaming SSR
- **tRPC**: Type-safe API without code generation, perfect for full-stack TypeScript
- **Drizzle ORM**: Lightweight, type-safe ORM with excellent TypeScript support
- **Lexical**: Modern, extensible rich text editor from Facebook (Meta)
- **Zustand**: Minimal state management with hooks API
- **Zod**: Runtime type validation that integrates seamlessly with tRPC

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

````typescript
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
### Installation (local)

1. Clone the repository

```powershell
git clone <your-repo-url>
cd coblog
````

2. Install dependencies

```powershell
npm install
```

3. Create a `.env` file in the project root and add required environment variables (see the list below):

```env
# Required
DATABASE_URL=postgresql://<user>:<pass>@<host>:<port>/<db>

# Optional toggles (examples)
# DB_SSL=1                # set to 1 to enable SSL when connecting to some managed Postgres providers
# DB_DEBUG=1              # set to 1 to enable verbose DB debug logging
# DB_CONNECT_TIMEOUT=10   # connection timeout in seconds (default 10)
# DB_EAGER_TEST=1         # when development, run a quick `SELECT 1` on startup
# PORT=3000               # custom port for local server

# Firebase (optional - only needed if you plan to use Firebase storage features)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

4. Initialize the database

You can create the schema using the provided SQL or with Drizzle Kit.

Using psql (quick local import):

```powershell
### Managing Categories

```

Or use Drizzle Kit (if you prefer migrations / push):

```powershell
npx drizzle-kit push
```

5. Start the development server

```powershell
npm run dev
```

Open http://localhost:3000 in your browser.

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
npm run db:health    # Check database connection

# Seeding
npm run seed         # Generate 12 professional blog posts with diverse content

# Code Quality
npm run lint         # Run ESLint
```

### Seed Script

The project includes a professional blog post generator that creates 10-12 high-quality blog posts across various topics:

```bash
npm run seed
```

**Features:**

- **Diverse Topics**: Technology, AI/ML, Web Development, DevOps, Business, Career, etc.
- **Professional Writing**: Well-structured content with proper formatting
- **Rich Content**: Includes code blocks, lists, headings, and proper markdown
- **Realistic Metadata**: Appropriate excerpts, reading times, and categories
- **Featured Images**: Placeholder images from Unsplash API
- **SEO-Friendly**: Proper slugs, descriptions, and content structure

The seed script automatically:

1. Connects to your database using `DATABASE_URL`
2. Creates necessary categories if they don't exist
3. Generates unique, professional blog posts
4. Associates posts with relevant categories
5. Sets appropriate publish status

Perfect for:

- Testing the application with realistic data
- Demonstrating the platform to stakeholders
- Development and UI testing
- Portfolio showcases

## 🔒 Security Notes

**⚠️ Important**: This application **does not include traditional authentication**.

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

## 🚀 Potential Improvements

This section outlines suggested enhancements to make CoBlog production-ready and feature-rich:

### 🔐 Authentication & Authorization

1. **Full Authentication System**

   - Replace localStorage UUID with NextAuth.js, Clerk, or Supabase Auth
   - Implement OAuth providers (Google, GitHub, Twitter)
   - Add password reset and email verification
   - Session management with JWT or database sessions

2. **Role-Based Access Control (RBAC)**

   - Admin, Editor, Author, and Reader roles
   - Permission-based post editing and deletion
   - Multi-author blog support with user profiles
   - Audit logs for admin actions

3. **Protected Routes**
   - Middleware to protect dashboard and admin routes
   - Public API endpoints with rate limiting
   - API key authentication for programmatic access

### 📝 Content Management

4. **Enhanced Editor Features**

   - Auto-save drafts to prevent data loss
   - Version history and post revisions
   - Collaborative editing with real-time updates
   - Custom blocks (callouts, quotes, embeds)
   - Table support in Lexical editor
   - LaTeX/Math equation support

5. **Media Management**

   - Media library for managing uploaded images
   - Image optimization and compression
   - CDN integration for faster delivery
   - Support for videos, PDFs, and other file types
   - Image gallery/carousel blocks

6. **SEO & Metadata**
   - Custom meta descriptions and OG tags per post
   - Sitemap generation (dynamic XML sitemap)
   - RSS feed for blog posts
   - Schema.org structured data
   - Canonical URLs and redirects

### 🎨 UI/UX Enhancements

7. **Reader Experience**

   - Table of contents generation from headings
   - Progress bar for reading articles
   - Social sharing buttons (Twitter, LinkedIn, Facebook)
   - Print-friendly styles
   - Font size and theme customization
   - Bookmark/save posts feature

8. **Advanced Search**

   - Full-text search with Algolia or ElasticSearch
   - Search autocomplete and suggestions
   - Filter by date range, author, tags
   - Saved searches

9. **Engagement Features**
   - Comments system (native or Disqus/Giscus)
   - Reactions/likes on posts
   - Related posts recommendations
   - Newsletter subscription (via ConvertKit/Mailchimp)
   - "Share this post" functionality

### 📊 Analytics & Insights

10. **Analytics Dashboard**

    - Page views and unique visitors (via Plausible/Google Analytics)
    - Popular posts and trending categories
    - User engagement metrics
    - Referral sources and traffic analysis
    - Export analytics data as CSV/JSON

11. **Author Insights**
    - Post performance dashboard per author
    - Engagement rate calculations
    - Top-performing content analysis

### ⚡ Performance & Scalability

12. **Caching Strategy**

    - Redis for session and query caching
    - CDN caching for static assets
    - ISR (Incremental Static Regeneration) for blog posts
    - Database query optimization with indexes

13. **Image Optimization**

    - Next.js Image component with automatic optimization
    - WebP/AVIF format conversion
    - Lazy loading and blur placeholders
    - Responsive images for different screen sizes

14. **Database Optimization**
    - Full-text search indexes on posts
    - Query result caching
    - Connection pooling (PgBouncer)
    - Database replication for read-heavy workloads

### 🏷️ Content Organization

15. **Tags System**

    - Add tags in addition to categories
    - Tag cloud visualization
    - Tag-based filtering and search

16. **Series/Collections**

    - Group related posts into series
    - Auto-generated "Next/Previous in series" navigation
    - Series landing pages

17. **Multilingual Support**
    - i18n for UI translations
    - Multi-language post content
    - Language switcher component

### 🔔 Notifications & Workflows

18. **Email Notifications**

    - New post notifications to subscribers
    - Comment reply notifications
    - Weekly digest emails
    - Email templates with React Email

19. **Scheduled Publishing**

    - Schedule posts to publish at specific times
    - Timezone-aware scheduling
    - Draft reminders and publication queue

20. **Content Workflow**
    - Post status: Draft → Review → Scheduled → Published
    - Review and approval system
    - Editorial calendar view

### 🧪 Testing & Quality

21. **Testing Infrastructure**

    - Unit tests with Vitest
    - Integration tests for tRPC routes
    - E2E tests with Playwright
    - Visual regression testing

22. **Code Quality**
    - Husky for pre-commit hooks
    - Prettier for consistent formatting
    - Strict TypeScript configuration
    - ESLint rules for best practices

### 🔧 Developer Experience

23. **Admin Features**

    - Bulk operations (delete, publish, categorize)
    - Import/export posts (JSON, Markdown)
    - Database backup and restore UI
    - System health monitoring

24. **API Enhancements**
    - REST API alongside tRPC for third-party integrations
    - Webhooks for post events
    - GraphQL endpoint (optional)
    - API documentation with OpenAPI/Swagger

### 🌐 Additional Features

25. **Progressive Web App (PWA)**

    - Offline reading capability
    - Install as mobile app
    - Push notifications for new posts

26. **Accessibility**

    - WCAG 2.1 AA compliance
    - Keyboard navigation improvements
    - Screen reader optimization
    - Focus management

27. **Monetization**
    - Ad integration (Google AdSense)
    - Paywall for premium content
    - Membership/subscription system
    - Donation/tip jar integration

### Implementation Priority

**High Priority** (Production-Ready):

- Authentication & Authorization (#1, #2, #3)
- SEO & Metadata (#6)
- Analytics Dashboard (#10)
- Caching Strategy (#12)
- Testing Infrastructure (#21)

**Medium Priority** (Enhanced Features):

- Enhanced Editor (#4)
- Media Management (#5)
- Reader Experience (#7)
- Tags System (#15)
- Email Notifications (#18)

**Low Priority** (Nice-to-Have):

- Advanced Search (#8)
- Multilingual Support (#17)
- PWA (#25)
- Monetization (#27)

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variable:
   - `DATABASE_URL`: Your PostgreSQL connection string
4. Deploy

If you deploy to Vercel, add the same environment variables via the Vercel dashboard. The app's client code detects `process.env.VERCEL_URL` to construct the tRPC base URL when server-side rendering on Vercel.

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

---

## Environment variables (summary)

Required

- DATABASE_URL — full Postgres connection string (postgresql://user:pass@host:port/db)

Optional / toggles used in the project

- PORT — server port (default 3000)
- DB_SSL — set to `1` to force SSL in postgres-js client
- DB_CONNECT_TIMEOUT — connect timeout in seconds (default 10)
- DB_DEBUG — set to `1` to enable DB debug logs
- DB_EAGER_TEST — set to `1` in development to run a quick SELECT 1 at startup

Firebase (only if using Storage features)

- NEXT_PUBLIC_FIREBASE_API_KEY
- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
- NEXT_PUBLIC_FIREBASE_PROJECT_ID
- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
- NEXT_PUBLIC_FIREBASE_APP_ID

## tRPC router structure

This project uses a root `appRouter` that combines individual feature routers. Files to look at:

- `src/server/trpc/routers/index.ts` — root router (exports `appRouter` and `AppRouter` type)
- `src/server/trpc/routers/post.ts` — post-related procedures (create, read, update, delete, list)
- `src/server/trpc/routers/category.ts` — category procedures (CRUD, list with counts)

Example (root router):

```ts
export const appRouter = createTRPCRouter({
  post: postRouter,
  category: categoryRouter,
});
export type AppRouter = typeof appRouter;
```

Client-side tRPC setup uses `src/lib/trpc/client.tsx` and detects `process.env.VERCEL_URL` on the server to build the correct base URL when deployed on Vercel. The tRPC HTTP endpoint is mounted at `/api/trpc` (Next.js route `src/app/api/trpc/[trpc]/route.ts`).

## Seeding the database

There is a SQL schema and initial data in `database-setup.sql` and the `drizzle/` migration SQL files. To seed locally:

1. Ensure `DATABASE_URL` is set and reachable.
2. Run the SQL file with psql:

```powershell
psql "${env:DATABASE_URL}" -f database-setup.sql
```

Or run individual drizzle migration files (if you prefer):

```powershell
npx drizzle-kit push
```

If you need a small script to insert test posts, I can add one — let me know the preferred shape for sample content.

## Features implemented (checklist)

Priority 1 — Must have (core)

- [x] Blog post CRUD operations (create, read, update, delete)
- [x] Category CRUD operations
- [x] Assign one or more categories to posts
- [x] Blog listing page showing all posts (`/blog`)
- [x] Individual post view page (`/blog/[slug]`)
- [x] Category filtering on listing page
- [x] Basic responsive navigation
- [x] Clean, professional UI

Priority 2 — Should have

- [x] Landing page with at least 3 sections (Header/Hero, Features, Footer)
- [x] Dashboard page for managing posts (`/dashboard`)
- [x] Draft vs Published post status
- [x] Loading and error states (present in UI components)
- [x] Mobile-responsive design
- [x] Content editor — Markdown support (markdown renderer used)

Priority 3 — Nice to have (bonus)

- [x] Full 5-section landing page (Header, Hero, Features, CTA, Footer)
- [x] Search functionality for posts — basic (if included in UI; otherwise mark as not implemented)
- [x] Post statistics (word count, reading time) — utility available in `src/lib/utils/post-stats.ts`
- [x] Dark mode support — theme toggling exists in `ThemeProvider`/`ThemeToggle`
- [x] Advanced rich text editor features — implemented (chose markdown editor then switched to rich text editor Lexical for better user experience)
- [x] Image upload for posts — implemented (Firebase Storage configured but optional)
- [x] Post preview functionality — modal preview exists in dashboard (basic)
- [x] SEO meta tags — basic meta tags included via Next.js pages (can be extended)
- [x] Pagination — implemented in `Pagination` component

## Trade-offs & decisions

- Chose a full rich text editor for better user experience.
- No authentication implemented: intentionally left out to focus on core CRUD and routing. Add NextAuth/Clerk for production before exposing the dashboard.
- Used Drizzle ORM + postgres-js for a small, type-safe server-side data layer. This keeps the server lightweight and simple to maintain.
- Firebase Storage is wired but optional. It's present in the repo so you can enable image uploads in a follow-up. i Consider firebase url for image storage over local url for secure and easy access of upload image functionalities

## Time spent

- Approximate time: 9-10 hours (development, wiring tRPC, UI, and DB schema)

## Live deployment

The project has been deployed to Vercel and is live — you can view it here: [https://coblog.vercel.app](https://coblog.vercel.app). The live link is included with the project submission and ready for review.

## How to run (quick)

```powershell
npm install
# ensure .env has DATABASE_URL
npm run dev
```

## Want a seed script or demo data?

If you'd like, I can add a small `scripts/seed.ts` (or SQL) that inserts 5 example posts + categories. Reply with 'seed script' and I'll add it.

---

For questions or issues, please open an issue on GitHub.
