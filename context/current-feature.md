# Current Feature

Dashboard Collections

## Status

In Progress

## Goals

- Create `src/lib/db/collections.ts` with data fetching functions
- Replace mock collection data in the dashboard main area with real data from Neon DB via Prisma
- Collection card border color derived from most-used content type in that collection
- Show small icons of all types present in each collection
- Keep the current design (6 cards grid layout)
- Update collection stats display

## Notes

- Full spec: `context/features/dashboard-collections-spec.md`
- Fetch collections directly in server component (no client fetching)
- Do not add items underneath collections yet — that comes later
- Reference `context/screenshots/dashboard-ui-main.png` for design

## History

- Initial Next.js setup and boilerplate cleanup
- Dashboard UI Phase 1: ShadCN setup, /dashboard route, dark mode, top bar with search and buttons, sidebar and main placeholders
- Dashboard UI Phase 2: Collapsible sidebar with item type links, favorite/recent collections, user avatar area, mobile drawer support
- Dashboard UI Phase 3: Stats cards, collections grid with type icons, pinned items section, 10 recent items section using mock data
- Neon PostgreSQL + Prisma Setup: Prisma 7 ORM with Neon PostgreSQL, initial schema with NextAuth models, indexes, and cascade deletes
- Seed Data: Seed script with demo user, system item types, collections, and items; wired up via `npx prisma db seed`
