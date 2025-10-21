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

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Local Postgres via Docker

We provide Docker Compose for live development (app + Postgres + Prisma Studio).

1) Start DB and set `DATABASE_URL` in `.env.local`:

```bash
docker compose up -d
```

`.env.local`:

```env
DATABASE_URL=postgresql://robotaxi:robotaxi@localhost:5432/robotaximap
```

2) Apply schema and seed (optional if web service already pushed migrations):

```bash
npm run prisma:migrate
npm run prisma:seed
```

Utilities:

```bash
docker compose logs -f web
docker compose logs -f db
docker compose down
docker compose down -v  # drop db volume
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
