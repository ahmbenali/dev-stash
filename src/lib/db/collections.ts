import { prisma } from '@/lib/prisma'

export type CollectionWithMeta = {
  id: string
  name: string
  description: string | null
  isFavorite: boolean
  updatedAt: Date
  itemCount: number
  dominantColor: string | null
  types: { name: string; icon: string | null; color: string | null }[]
}

export async function getRecentCollections(
  limit = 6
): Promise<CollectionWithMeta[]> {
  const collections = await prisma.collection.findMany({
    orderBy: { updatedAt: 'desc' },
    take: limit,
    include: {
      items: {
        include: { type: true },
      },
    },
  })

  return collections.map(collection => {
    const typeCounts = new Map<
      string,
      {
        count: number
        type: { name: string; icon: string | null; color: string | null }
      }
    >()

    for (const item of collection.items) {
      const entry = typeCounts.get(item.typeId)
      if (entry) {
        entry.count++
      } else {
        typeCounts.set(item.typeId, { count: 1, type: item.type })
      }
    }

    let dominantColor: string | null = null
    let maxCount = 0
    const types: { name: string; icon: string | null; color: string | null }[] =
      []

    for (const [, { count, type }] of typeCounts) {
      types.push(type)
      if (count > maxCount) {
        maxCount = count
        dominantColor = type.color
      }
    }

    return {
      id: collection.id,
      name: collection.name,
      description: collection.description,
      isFavorite: collection.isFavorite,
      updatedAt: collection.updatedAt,
      itemCount: collection.items.length,
      dominantColor,
      types: types.slice(0, 5),
    }
  })
}
