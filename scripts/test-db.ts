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
    console.log('✓ Connection successful')

    const tableCount = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*) as count
      FROM information_schema.tables
      WHERE table_schema = 'public'
    `
    console.log(`✓ Tables in public schema: ${tableCount[0].count}`)

    const itemTypes = await prisma.itemType.findMany({
      where: { isSystem: true },
      select: { name: true, icon: true, color: true },
    })

    if (itemTypes.length > 0) {
      console.log(`✓ System item types (${itemTypes.length}):`)
      itemTypes.forEach(t =>
        console.log(`    ${t.name} — ${t.icon} ${t.color}`)
      )
    } else {
      console.log('  No system item types found. Run: npm run db:seed')
    }
  } finally {
    await prisma.$disconnect()
  }
}

main().catch(e => {
  console.error('✗ Database test failed:', e.message)
  process.exit(1)
})
