# Current Feature

None

## Status

Completed

## Goals

## Notes

## History

- Initial Next.js setup and boilerplate cleanup
- Dashboard UI Phase 1: ShadCN setup, /dashboard route, dark mode, top bar with search and buttons, sidebar and main placeholders
- Dashboard UI Phase 2: Collapsible sidebar with item type links, favorite/recent collections, user avatar area, mobile drawer support
- Dashboard UI Phase 3: Stats cards, collections grid with type icons, pinned items section, 10 recent items section using mock data
- Neon PostgreSQL + Prisma Setup: Prisma 7 ORM with Neon PostgreSQL, initial schema with NextAuth models, indexes, and cascade deletes
- Seed Data: Seed script with demo user, system item types, collections, and items; wired up via `npx prisma db seed`
- Dashboard Collections: Replaced mock collections with real DB data; collection card border color from most-used type; type icons shown per card
- Dashboard Items: Replaced mock pinned and recent items with real DB data; item card icon/border derived from item type; pinned section hidden when empty
- Stats & Sidebar from DB: StatsCards and sidebar item types/collections now sourced from DB; colored dot for recent collections; "View all collections" link added; item types ordered by custom sort
