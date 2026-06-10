import 'dotenv/config'
import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set')
  }

  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
  const prisma = new PrismaClient({ adapter })

  try {
    console.log('Testing database connection...')
    await prisma.$queryRaw`SELECT 1`
    console.log('✓ Connection successful\n')

    // ── System item types ──────────────────────────────────────────────────────
    const itemTypes = await prisma.itemType.findMany({
      where: { isSystem: true },
      select: { name: true, icon: true, color: true },
      orderBy: { name: 'asc' },
    })
    console.log(`System item types (${itemTypes.length}):`)
    for (const t of itemTypes) {
      console.log(`  ${t.name.padEnd(10)} icon=${t.icon}  color=${t.color}`)
    }

    // ── Demo user ──────────────────────────────────────────────────────────────
    console.log()
    const user = await prisma.user.findUnique({
      where: { email: 'demo@devstash.io' },
      select: { id: true, name: true, email: true, isPro: true, password: true },
    })

    if (!user) {
      console.log('✗ Demo user not found — run: npm run db:seed')
      return
    }

    const passwordOk = user.password && user.password.startsWith('$2')
    console.log('Demo user:')
    console.log(`  name:     ${user.name}`)
    console.log(`  email:    ${user.email}`)
    console.log(`  isPro:    ${user.isPro}`)
    console.log(`  password: ${passwordOk ? '✓ bcrypt hash present' : '✗ missing or invalid'}`)

    // ── Collections ────────────────────────────────────────────────────────────
    console.log()
    const collections = await prisma.collection.findMany({
      where: { userId: user.id },
      select: {
        name: true,
        description: true,
        _count: { select: { items: true } },
      },
      orderBy: { name: 'asc' },
    })
    console.log(`Collections (${collections.length}):`)
    for (const c of collections) {
      console.log(`  ${c.name.padEnd(22)} ${c._count.items} item(s)  — ${c.description}`)
    }

    // ── Items by type ──────────────────────────────────────────────────────────
    console.log()
    const items = await prisma.item.findMany({
      where: { userId: user.id },
      select: {
        title: true,
        contentType: true,
        url: true,
        language: true,
        type: { select: { name: true } },
        collection: { select: { name: true } },
      },
      orderBy: [{ type: { name: 'asc' } }, { title: 'asc' }],
    })
    console.log(`Items (${items.length}):`)
    for (const item of items) {
      const detail = item.url ?? item.language ?? ''
      console.log(
        `  [${item.type.name.padEnd(8)}] ${item.title.padEnd(30)} collection=${item.collection?.name ?? '—'}${detail ? `  (${detail})` : ''}`
      )
    }

    // ── Summary ────────────────────────────────────────────────────────────────
    console.log()
    const expectedTypes = 7
    const expectedCollections = 5
    const expectedItems = 18
    const pass = (ok: boolean, msg: string) => console.log(`${ok ? '✓' : '✗'} ${msg}`)

    console.log('Verification:')
    pass(itemTypes.length === expectedTypes, `${itemTypes.length}/${expectedTypes} system item types`)
    pass(!!user, 'Demo user exists')
    pass(!!passwordOk, 'Password is bcrypt hashed')
    pass(collections.length === expectedCollections, `${collections.length}/${expectedCollections} collections`)
    pass(items.length === expectedItems, `${items.length}/${expectedItems} items`)

  } finally {
    await prisma.$disconnect()
  }
}

main().catch(e => {
  console.error('✗ Database test failed:', e.message)
  process.exit(1)
})
