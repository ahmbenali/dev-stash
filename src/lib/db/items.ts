import { prisma } from '@/lib/prisma'

export type ItemWithMeta = {
  id: string
  title: string
  description: string | null
  isPinned: boolean
  createdAt: Date
  tags: string[]
  type: {
    name: string
    icon: string | null
    color: string | null
  }
}

const itemInclude = {
  type: true,
  tags: { include: { tag: true } },
} as const

function mapItem(item: {
  id: string
  title: string
  description: string | null
  isPinned: boolean
  createdAt: Date
  type: { name: string; icon: string | null; color: string | null }
  tags: { tag: { name: string } }[]
}): ItemWithMeta {
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    isPinned: item.isPinned,
    createdAt: item.createdAt,
    tags: item.tags.map((t) => t.tag.name),
    type: item.type,
  }
}

export async function getPinnedItems(): Promise<ItemWithMeta[]> {
  const items = await prisma.item.findMany({
    where: { isPinned: true },
    orderBy: { updatedAt: 'desc' },
    include: itemInclude,
  })
  return items.map(mapItem)
}

export async function getRecentItems(limit = 10): Promise<ItemWithMeta[]> {
  const items = await prisma.item.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: itemInclude,
  })
  return items.map(mapItem)
}
