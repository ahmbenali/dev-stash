import 'dotenv/config'
import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

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

async function main() {
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

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
