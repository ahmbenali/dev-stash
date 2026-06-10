# Current Feature

Prisma + Neon PostgreSQL Setup

## Status

Completed

## Goals

- Install and configure Prisma 7 (note breaking changes)
- Connect to Neon PostgreSQL (serverless) via DATABASE_URL
- Create initial schema from project-overview.md data models
- Include NextAuth models (Account, Session, VerificationToken)
- Add appropriate indexes and cascade deletes
- Create initial migration (never db push)

## Notes

- Use Prisma 7 — read upgrade guide for breaking changes before implementing
- dev branch = DATABASE_URL, prod branch separate — always migrate, never db push
- Full spec: `context/features/database-spec.md`

## History

- Initial Next.js setup and boilerplate cleanup
- Dashboard UI Phase 1: ShadCN setup, /dashboard route, dark mode, top bar with search and buttons, sidebar and main placeholders
- Dashboard UI Phase 2: Collapsible sidebar with item type links, favorite/recent collections, user avatar area, mobile drawer support
- Dashboard UI Phase 3: Main area with stats cards, recent collections grid with type icons, pinned items, and 10 recent items
- Prisma + Neon PostgreSQL: Prisma 7 setup with pg adapter, full schema (User, Item, ItemType, Collection, Tag, NextAuth models), migrations workflow
