This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3001](http://localhost:3001) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Local Development Setup

This project uses Docker for the database and Prisma Studio, while Next.js runs locally for better development experience.

### Quick Start

1) **Start development environment:**
```bash
npm run dev
```

This will:
- Start PostgreSQL database in Docker (port 5432)
- Start Prisma Studio in Docker (http://localhost:5555)
- Start Next.js locally on port 3001

2) **First time setup - Apply database schema:**
```bash
npm run prisma:migrate
npm run prisma:seed
```

### Environment Configuration

Environment variables are configured in `.env.local`:
```env
# Database
DATABASE_URL=postgresql://robotaxi:robotaxi@localhost:5432/robotaximap
DIRECT_URL=postgresql://robotaxi:robotaxi@localhost:5432/robotaximap

# NextAuth
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your-secret-key-here

# Public config
NEXT_PUBLIC_SITE_URL=http://localhost:3001
```

### Troubleshooting

**Port 3001 already in use:**
```bash
# Stop any existing Next.js processes
taskkill /f /im node.exe

# Or use a different port
npm run dev -- -p 3002
```

**Docker orphan containers warning:**
```bash
# Clean up orphaned containers
docker compose up -d --remove-orphans
```

**Database connection issues:**
```bash
# Check if database is running
docker ps

# View database logs
docker compose logs -f db

# Reset database
docker compose down -v
docker compose up -d
npm run prisma:migrate
npm run prisma:seed
```

### Utilities

```bash
# View logs
docker compose logs -f db
docker compose logs -f studio

# Stop services
docker compose down

# Reset everything (including data)
docker compose down -v
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Environment

Create a local env file and configure production variables on your host (e.g. Vercel):

```bash
cp env.example .env.local
```

Required variables:

- `NEXTAUTH_SECRET`: random string for session security
- `NEXTAUTH_URL`: origin URL in production (Vercel sets automatically)
- `DATABASE_URL`: Prisma connection string
- `NEXT_PUBLIC_MAPTILER_KEY` (optional): Maptiler API key for base map
