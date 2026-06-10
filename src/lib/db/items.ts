import { prisma } from '@/lib/prisma'

export type ItemStats = {
  totalItems: number
  totalCollections: number
  favoriteItems: number
  favoriteCollections: number
}

export type ItemTypeWithCount = {
  id: string
  name: string
  icon: string | null
  color: string | null
  count: number
}

export async function getItemStats(): Promise<ItemStats> {
  const [totalItems, totalCollections, favoriteItems, favoriteCollections] =
    await Promise.all([
      prisma.item.count(),
      prisma.collection.count(),
      prisma.item.count({ where: { isFavorite: true } }),
      prisma.collection.count({ where: { isFavorite: true } }),
    ])

  return { totalItems, totalCollections, favoriteItems, favoriteCollections }
}

const TYPE_ORDER = ['snippet', 'prompt', 'command', 'note', 'file', 'image', 'link']

export async function getItemTypesWithCounts(): Promise<ItemTypeWithCount[]> {
  const types = await prisma.itemType.findMany({
    where: { isSystem: true },
    include: { _count: { select: { items: true } } },
  })

  return types
    .map((t) => ({
      id: t.id,
      name: t.name,
      icon: t.icon,
      color: t.color,
      count: t._count.items,
    }))
    .sort((a, b) => {
      const ai = TYPE_ORDER.indexOf(a.name)
      const bi = TYPE_ORDER.indexOf(b.name)
      return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi)
    })
}

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
