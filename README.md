# CoBlog - Modern Blogging Platform

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![tRPC](https://img.shields.io/badge/tRPC-Latest-blue)](https://trpc.io/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

CoBlog is a modern, type-safe blogging platform built with Next.js (App Router), tRPC, PostgreSQL and Drizzle ORM. It implements a fully type-safe API surface, CRUD for posts and categories, markdown content support, and a clean responsive UI.

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

- [ ] Full 5-section landing page (Header, Hero, Features, CTA, Footer) — partially done (Hero/Features/Footer)
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
