# Current Feature

Dashboard Items

## Status

Completed

## Goals

- Create `src/lib/db/items.ts` with data fetching functions
- Replace mock item data in the dashboard main area with real data from Neon DB via Prisma
- Applies to both pinned items and recent items sections
- If there are no pinned items, nothing should display in the pinned section
- Item card icon/border derived from the item type
- Display item type tags and anything else currently shown
- Fetch items directly in server component (no client fetching)

## Notes

- Full spec: `context/features/dashboard-items-spec.md`
- Reference `context/screenshots/dashboard-ui-main.png` for design

## History

- Initial Next.js setup and boilerplate cleanup
- Dashboard UI Phase 1: ShadCN setup, /dashboard route, dark mode, top bar with search and buttons, sidebar and main placeholders
- Dashboard UI Phase 2: Collapsible sidebar with item type links, favorite/recent collections, user avatar area, mobile drawer support
- Dashboard UI Phase 3: Stats cards, collections grid with type icons, pinned items section, 10 recent items section using mock data
- Neon PostgreSQL + Prisma Setup: Prisma 7 ORM with Neon PostgreSQL, initial schema with NextAuth models, indexes, and cascade deletes
- Seed Data: Seed script with demo user, system item types, collections, and items; wired up via `npx prisma db seed`
- Dashboard Collections: Replaced mock collections with real DB data; collection card border color from most-used type; type icons shown per card
