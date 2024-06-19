# Project Showcase

> A simple project / idea app

I made this simple NextJS app with Drizzle and TRPC to learn more about web development and the new server actions and RSC. The UI is still somewhat buggy. The app also has a very basic CI pipeline for both dev and "staging" environments, although I have only one branch for both. The app is deployed on Railway and the KV store is provided by Vercel. The app has an unnecessary complex data access layer with both TRPC server router and server actions just to get some experience of both. The RDBMS of choice is Postgres since for a general purpose DB system SQL works best. Most of the UI is made with shadcn/ui components with some Tailwind mixed in. I tried to avoid using hooks for data fetching just for the sake on learning SSR with server actions which makes TRPC pointless in this context (TRPC procedures do provide an easy Zod validation layer out of the box)

For local development I have a Postgres container running on docker-compose.

For testing I chose Playwright E2E. Might add a package for unit or integration testing later.

### TODO

-   More tests
-   Ratelimiting error for better UX
-   Create a project from "my repos"
-   Sentry !!!
