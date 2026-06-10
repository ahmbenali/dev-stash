# Current Feature

Seed Data

## Status

In Progress

## Goals

- Create `prisma/seed.ts` to populate the database with sample data for development and demos
- Seed a demo user, system item types, collections, and items per the spec
- Wire up the seed script in `package.json`

## Notes

- Full spec: `context/features/seed-spec.md`
- Hash password with bcryptjs, 12 rounds
- Icons are Lucide React component name strings (stored as text)
- All system item types have `isSystem: true` and no `userId`
- Use real URLs for link items
- Run with `npx prisma db seed` after implementation

## History

- Initial Next.js setup and boilerplate cleanup
- Dashboard UI Phase 1: ShadCN setup, /dashboard route, dark mode, top bar with search and buttons, sidebar and main placeholders
- Dashboard UI Phase 2: Collapsible sidebar with item type links, favorite/recent collections, user avatar area, mobile drawer support
- Dashboard UI Phase 3: Stats cards, collections grid with type icons, pinned items section, 10 recent items section using mock data
- Neon PostgreSQL + Prisma Setup: Prisma 7 ORM with Neon PostgreSQL, initial schema with NextAuth models, indexes, and cascade deletes
