import 'dotenv/config'
import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

const systemItemTypes = [
  { name: 'snippet', icon: 'Code',       color: '#3b82f6' },
  { name: 'prompt',  icon: 'Sparkles',   color: '#8b5cf6' },
  { name: 'command', icon: 'Terminal',   color: '#f97316' },
  { name: 'note',    icon: 'StickyNote', color: '#fde047' },
  { name: 'file',    icon: 'File',       color: '#6b7280' },
  { name: 'image',   icon: 'Image',      color: '#ec4899' },
  { name: 'link',    icon: 'Link',       color: '#10b981' },
]

async function seedItemTypes() {
  console.log('Seeding system item types...')
  for (const type of systemItemTypes) {
    const existing = await prisma.itemType.findFirst({
      where: { name: type.name, isSystem: true },
    })
    if (existing) {
      await prisma.itemType.update({
        where: { id: existing.id },
        data: { icon: type.icon, color: type.color },
      })
    } else {
      await prisma.itemType.create({
        data: { ...type, isSystem: true },
      })
    }
  }
  console.log(`Seeded ${systemItemTypes.length} system item types.`)
}

async function seedDemoUser() {
  console.log('Seeding demo user...')
  const existing = await prisma.user.findUnique({
    where: { email: 'demo@devstash.io' },
  })
  if (existing) {
    console.log('Demo user already exists, skipping.')
    return existing
  }
  const hashed = await bcrypt.hash('12345678', 12)
  const user = await prisma.user.create({
    data: {
      email: 'demo@devstash.io',
      name: 'Demo User',
      password: hashed,
      isPro: false,
    },
  })
  console.log('Demo user created.')
  return user
}

async function seedCollectionsAndItems(userId: string, typeMap: Record<string, string>) {
  console.log('Seeding collections and items...')

  // ── React Patterns ──────────────────────────────────────────────────────────
  const reactPatterns = await prisma.collection.upsert({
    where: { id: 'seed-collection-react-patterns' },
    update: {},
    create: {
      id: 'seed-collection-react-patterns',
      name: 'React Patterns',
      description: 'Reusable React patterns and hooks',
      userId,
    },
  })

  const reactSnippets = [
    {
      id: 'seed-item-react-1',
      title: 'Custom Hooks',
      content: `import { useState, useEffect } from 'react'

export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}

export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initial
    } catch {
      return initial
    }
  })
  const set = (v: T) => {
    setValue(v)
    window.localStorage.setItem(key, JSON.stringify(v))
  }
  return [value, set] as const
}`,
      language: 'typescript',
      description: 'useDebounce and useLocalStorage custom hooks',
    },
    {
      id: 'seed-item-react-2',
      title: 'Component Patterns',
      content: `import { createContext, useContext, useState } from 'react'

// Context provider pattern
const ThemeContext = createContext<{ dark: boolean; toggle: () => void } | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(true)
  return (
    <ThemeContext.Provider value={{ dark, toggle: () => setDark(d => !d) }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}

// Compound component pattern
export function Tabs({ children }: { children: React.ReactNode }) {
  return <div className="tabs">{children}</div>
}
Tabs.Tab = function Tab({ label, children }: { label: string; children: React.ReactNode }) {
  return <div data-label={label}>{children}</div>
}`,
      language: 'typescript',
      description: 'Context providers and compound components',
    },
    {
      id: 'seed-item-react-3',
      title: 'Utility Functions',
      content: `import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  }).format(new Date(date))
}

export function truncate(str: string, max: number): string {
  return str.length > max ? str.slice(0, max) + '…' : str
}

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}`,
      language: 'typescript',
      description: 'cn, formatDate, truncate, sleep helpers',
    },
  ]

  for (const s of reactSnippets) {
    await prisma.item.upsert({
      where: { id: s.id },
      update: {},
      create: {
        id: s.id,
        title: s.title,
        contentType: 'text',
        content: s.content,
        language: s.language,
        description: s.description,
        userId,
        typeId: typeMap['snippet'],
        collectionId: reactPatterns.id,
      },
    })
  }

  // ── AI Workflows ─────────────────────────────────────────────────────────────
  const aiWorkflows = await prisma.collection.upsert({
    where: { id: 'seed-collection-ai-workflows' },
    update: {},
    create: {
      id: 'seed-collection-ai-workflows',
      name: 'AI Workflows',
      description: 'AI prompts and workflow automations',
      userId,
    },
  })

  const aiPrompts = [
    {
      id: 'seed-item-ai-1',
      title: 'Code Review Prompt',
      content: `Review the following code for:
- Correctness and logic errors
- Security vulnerabilities (XSS, SQL injection, auth issues)
- Performance (unnecessary re-renders, N+1 queries, unoptimized loops)
- Readability and naming
- Missing edge cases

Provide specific, actionable feedback with line references where applicable.
Be concise — skip praise, focus on issues.

\`\`\`
{CODE}
\`\`\``,
      description: 'Structured code review prompt for AI assistants',
    },
    {
      id: 'seed-item-ai-2',
      title: 'Documentation Generation',
      content: `Generate concise documentation for the following code.

Include:
- One-sentence summary of what it does
- Parameters / props table (name, type, description, required)
- Return value description
- One usage example

Keep it tight — no filler. Output in Markdown.

\`\`\`
{CODE}
\`\`\``,
      description: 'Generate clean Markdown docs from code',
    },
    {
      id: 'seed-item-ai-3',
      title: 'Refactoring Assistance',
      content: `Refactor the following code to improve:
- Readability (clear naming, smaller functions)
- Performance (remove redundant work, improve data structures)
- Maintainability (reduce coupling, improve separation of concerns)

Rules:
- Do NOT change external behavior or public API
- Do NOT add new features
- Explain each change in a short bullet list after the code

\`\`\`
{CODE}
\`\`\``,
      description: 'Refactor code while preserving behavior',
    },
  ]

  for (const p of aiPrompts) {
    await prisma.item.upsert({
      where: { id: p.id },
      update: {},
      create: {
        id: p.id,
        title: p.title,
        contentType: 'text',
        content: p.content,
        description: p.description,
        userId,
        typeId: typeMap['prompt'],
        collectionId: aiWorkflows.id,
      },
    })
  }

  // ── DevOps ───────────────────────────────────────────────────────────────────
  const devops = await prisma.collection.upsert({
    where: { id: 'seed-collection-devops' },
    update: {},
    create: {
      id: 'seed-collection-devops',
      name: 'DevOps',
      description: 'Infrastructure and deployment resources',
      userId,
    },
  })

  await prisma.item.upsert({
    where: { id: 'seed-item-devops-snippet' },
    update: {},
    create: {
      id: 'seed-item-devops-snippet',
      title: 'Dockerfile (Node.js)',
      contentType: 'text',
      content: `FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

FROM base AS builder
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]`,
      language: 'dockerfile',
      description: 'Multi-stage Dockerfile for Next.js apps',
      userId,
      typeId: typeMap['snippet'],
      collectionId: devops.id,
    },
  })

  await prisma.item.upsert({
    where: { id: 'seed-item-devops-command' },
    update: {},
    create: {
      id: 'seed-item-devops-command',
      title: 'Deploy to Production',
      contentType: 'text',
      content: `#!/bin/bash
set -e

echo "Building image..."
docker build -t myapp:latest .

echo "Pushing to registry..."
docker tag myapp:latest registry.example.com/myapp:latest
docker push registry.example.com/myapp:latest

echo "Deploying..."
ssh deploy@prod.example.com "docker pull registry.example.com/myapp:latest && docker-compose up -d"

echo "Deploy complete."`,
      language: 'bash',
      description: 'Build, push, and deploy Docker image to production',
      userId,
      typeId: typeMap['command'],
      collectionId: devops.id,
    },
  })

  const devopsLinks = [
    {
      id: 'seed-item-devops-link-1',
      title: 'Docker Documentation',
      url: 'https://docs.docker.com',
      description: 'Official Docker docs — reference for Dockerfile, Compose, and CLI',
    },
    {
      id: 'seed-item-devops-link-2',
      title: 'GitHub Actions Docs',
      url: 'https://docs.github.com/en/actions',
      description: 'Official GitHub Actions documentation for CI/CD workflows',
    },
  ]

  for (const l of devopsLinks) {
    await prisma.item.upsert({
      where: { id: l.id },
      update: {},
      create: {
        id: l.id,
        title: l.title,
        contentType: 'text',
        url: l.url,
        description: l.description,
        userId,
        typeId: typeMap['link'],
        collectionId: devops.id,
      },
    })
  }

  // ── Terminal Commands ─────────────────────────────────────────────────────────
  const terminal = await prisma.collection.upsert({
    where: { id: 'seed-collection-terminal' },
    update: {},
    create: {
      id: 'seed-collection-terminal',
      name: 'Terminal Commands',
      description: 'Useful shell commands for everyday development',
      userId,
    },
  })

  const commands = [
    {
      id: 'seed-item-cmd-1',
      title: 'Git Operations',
      content: `# Undo last commit but keep changes staged
git reset --soft HEAD~1

# Squash last N commits into one
git rebase -i HEAD~N

# Stash with a message
git stash push -m "WIP: feature name"

# Show commits not yet in remote
git log origin/main..HEAD --oneline

# Clean untracked files (dry run first)
git clean -nd && git clean -fd`,
      description: 'Common git operations for day-to-day workflow',
    },
    {
      id: 'seed-item-cmd-2',
      title: 'Docker Commands',
      content: `# Remove all stopped containers
docker container prune -f

# Remove unused images, networks, volumes
docker system prune -af --volumes

# Follow logs for a service
docker compose logs -f service-name

# Run a command in a running container
docker exec -it container-name sh

# Inspect container environment variables
docker inspect container-name | jq '.[0].Config.Env'`,
      description: 'Handy Docker commands for container management',
    },
    {
      id: 'seed-item-cmd-3',
      title: 'Process Management',
      content: `# Find process on a port
lsof -i :3000

# Kill process on a port
kill -9 $(lsof -ti :3000)

# Watch CPU/memory for a process
watch -n 1 "ps aux | grep node"

# List all background jobs
jobs -l

# Run process in background and log output
nohup npm run dev > dev.log 2>&1 &`,
      description: 'Find, kill, and monitor processes',
    },
    {
      id: 'seed-item-cmd-4',
      title: 'Package Manager Utilities',
      content: `# Check for outdated packages
npm outdated

# Update all packages to latest (respects semver)
npm update

# Remove unused packages from node_modules
npm prune

# Audit and auto-fix vulnerabilities
npm audit fix

# List globally installed packages
npm list -g --depth=0

# Clear npm cache
npm cache clean --force`,
      description: 'npm commands for package management and maintenance',
    },
  ]

  for (const c of commands) {
    await prisma.item.upsert({
      where: { id: c.id },
      update: {},
      create: {
        id: c.id,
        title: c.title,
        contentType: 'text',
        content: c.content,
        language: 'bash',
        description: c.description,
        userId,
        typeId: typeMap['command'],
        collectionId: terminal.id,
      },
    })
  }

  // ── Design Resources ──────────────────────────────────────────────────────────
  const design = await prisma.collection.upsert({
    where: { id: 'seed-collection-design' },
    update: {},
    create: {
      id: 'seed-collection-design',
      name: 'Design Resources',
      description: 'UI/UX resources and references',
      userId,
    },
  })

  const designLinks = [
    {
      id: 'seed-item-design-1',
      title: 'Tailwind CSS Docs',
      url: 'https://tailwindcss.com/docs',
      description: 'Official Tailwind CSS v4 documentation and utility reference',
    },
    {
      id: 'seed-item-design-2',
      title: 'shadcn/ui Components',
      url: 'https://ui.shadcn.com',
      description: 'Open-source component library built on Radix UI and Tailwind',
    },
    {
      id: 'seed-item-design-3',
      title: 'Radix UI Primitives',
      url: 'https://www.radix-ui.com/primitives',
      description: 'Accessible, unstyled UI primitives for building design systems',
    },
    {
      id: 'seed-item-design-4',
      title: 'Lucide Icons',
      url: 'https://lucide.dev/icons',
      description: 'Searchable library of Lucide React icons with copy-paste code',
    },
  ]

  for (const l of designLinks) {
    await prisma.item.upsert({
      where: { id: l.id },
      update: {},
      create: {
        id: l.id,
        title: l.title,
        contentType: 'text',
        url: l.url,
        description: l.description,
        userId,
        typeId: typeMap['link'],
        collectionId: design.id,
      },
    })
  }

  console.log('Collections and items seeded.')
}

async function main() {
  await seedItemTypes()

  const user = await seedDemoUser()

  const types = await prisma.itemType.findMany({ where: { isSystem: true } })
  const typeMap = Object.fromEntries(types.map(t => [t.name, t.id]))

  await seedCollectionsAndItems(user.id, typeMap)

  console.log('Seed complete.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
