# Current Feature

Neon PostgreSQL + Prisma Setup

## Status

Completed

## Goals

- Set up Prisma 7 ORM with Neon PostgreSQL (serverless)
- Create initial schema based on data models in `context/project-overview.md`
- Include NextAuth models (Account, Session, VerificationToken)
- Add appropriate indexes and cascade deletes
- Always use `prisma migrate dev` — never `db push`

## Notes

- Full spec: `context/features/database-spec.md`
- Use Prisma 7 (breaking changes from v6 — see upgrade guide)
- DATABASE_URL = development branch, separate production branch
- Reference data models: `context/project-overview.md`

## History

- Initial Next.js setup and boilerplate cleanup
- Dashboard UI Phase 1: ShadCN setup, /dashboard route, dark mode, top bar with search and buttons, sidebar and main placeholders
- Dashboard UI Phase 2: Collapsible sidebar with item type links, favorite/recent collections, user avatar area, mobile drawer support
- Dashboard UI Phase 3: Stats cards, collections grid with type icons, pinned items section, 10 recent items section using mock data
