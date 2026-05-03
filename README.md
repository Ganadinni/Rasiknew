# Rasik – Culinary Maestro

> Internal recipe assistant for **The Tea Planet** team.  
> Built with Next.js 15 · TypeScript · Tailwind CSS · Prisma · Neon Postgres · Auth.js

---

## Stack

| Layer        | Technology                                    |
|--------------|-----------------------------------------------|
| Framework    | Next.js 15 App Router                         |
| Language     | TypeScript (strict)                           |
| Styling      | Tailwind CSS                                  |
| Database     | Neon Postgres (via Vercel Marketplace)        |
| ORM          | Prisma 5                                      |
| Auth         | Auth.js v5 (NextAuth) — JWT + Credentials     |
| Deployment   | Vercel                                        |

---

## Local Development Setup

### 1. Clone & install

```bash
git clone https://github.com/<your-org>/rasik-culinary-maestro.git
cd rasik-culinary-maestro
npm install
```

### 2. Create GitHub repository

```bash
# If not already done:
gh repo create rasik-culinary-maestro --private
git remote add origin https://github.com/<your-org>/rasik-culinary-maestro.git
git push -u origin main
```

### 3. Import to Vercel & connect Postgres

1. Go to [vercel.com](https://vercel.com) → **Add New Project** → import your repo.
2. In the Vercel dashboard → **Storage** tab → **Create Database** → choose **Neon Postgres**.
3. Vercel auto-populates `DATABASE_URL` and `DIRECT_URL` in your project's environment variables.

### 4. Pull env variables locally with Vercel CLI

```bash
npm i -g vercel
vercel login
vercel link          # links local directory to your Vercel project
vercel env pull .env # writes DATABASE_URL, DIRECT_URL, etc. to .env
```

### 5. Add remaining secrets to `.env`

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Generate ADMIN_PASSWORD_HASH (replace 'yourPassword')
node -e "require('bcryptjs').hash('yourPassword', 12).then(console.log)"
```

Add to `.env`:
```
NEXTAUTH_SECRET=<generated-secret>
NEXTAUTH_URL=http://localhost:3000
ADMIN_EMAIL=admin@teaplanet.com
ADMIN_PASSWORD_HASH=<generated-hash>
ADMIN_NAME=Tea Planet Admin
```

### 6. Run Prisma migrations

```bash
npm run db:generate    # generates Prisma client from schema
npm run db:migrate     # applies migrations to Neon Postgres
```

### 7. Seed the first admin user

```bash
npm run db:seed
```

### 8. Start the dev server

```bash
npm run dev
# → http://localhost:3000  (redirects to /admin/login)
```

---

## Project Structure

```
src/
├── app/
│   ├── admin/
│   │   ├── login/          # Login page (public)
│   │   └── dashboard/      # Protected dashboard (ADMIN/STAFF)
│   ├── api/
│   │   └── auth/[...nextauth]/  # Auth.js catch-all handler
│   ├── layout.tsx
│   ├── page.tsx            # Redirects → /admin/login
│   └── globals.css
├── components/
│   ├── admin/              # Admin-specific UI components
│   └── ui/                 # Shared headless / primitive components
├── lib/
│   ├── prisma.ts           # Singleton Prisma client
│   ├── auth.ts             # Auth.js configuration
│   └── validations.ts      # Zod schemas
├── server/
│   └── actions/            # Next.js Server Actions
│       └── auth.ts
└── types/
    └── index.ts            # Shared TypeScript types

prisma/
├── schema.prisma           # DB schema (User, Recipe)
└── seed.ts                 # First-run admin user seed
```

---

## Environment Variables Reference

| Variable             | Description                                              |
|----------------------|----------------------------------------------------------|
| `DATABASE_URL`       | Pooled Neon Postgres URL (PgBouncer)                    |
| `DIRECT_URL`         | Direct Neon URL for Prisma Migrate                      |
| `NEXTAUTH_SECRET`    | JWT signing secret (32+ random bytes)                   |
| `NEXTAUTH_URL`       | Canonical app URL (http://localhost:3000 in dev)        |
| `ADMIN_EMAIL`        | Email for the bootstrap admin account                   |
| `ADMIN_PASSWORD_HASH`| bcrypt hash of the admin password (cost factor 12)      |
| `ADMIN_NAME`         | Display name for the bootstrap admin                    |

---

## Useful Commands

```bash
npm run dev          # start dev server
npm run build        # production build
npm run lint         # ESLint check
npm run db:migrate   # apply pending Prisma migrations
npm run db:seed      # create/upsert bootstrap admin user
npm run db:studio    # open Prisma Studio (visual DB browser)
```

---

## Route Protection

`src/middleware.ts` runs at the edge on every `/admin/*` request:

- `/admin/login` → public; redirects to dashboard if already signed in.
- All other `/admin/**` → requires a valid Auth.js JWT session; unauthenticated visitors are redirected to `/admin/login`.

---

## Next Steps (Phase 2)

- [ ] Wire up Tea Planet recipe template (ingredient matrix, SKU, dosage, prep steps)
- [ ] Recipe CRUD — create / list / edit / delete
- [ ] OpenAI / Claude API integration for AI recipe assistant
- [ ] STAFF role — read-only recipe access
- [ ] PDF / print-ready recipe export
