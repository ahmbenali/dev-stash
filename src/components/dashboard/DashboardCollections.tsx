import Link from 'next/link'
import { Code, File, Image, Link as LinkIcon, Sparkles, Star, StickyNote, Terminal } from 'lucide-react'
import { getRecentCollections } from '@/lib/db/collections'

const iconMap: Record<string, React.ElementType> = {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  File,
  Image,
  Link: LinkIcon,
}

export default async function DashboardCollections() {
  const collections = await getRecentCollections()

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold">Collections</h2>
        <Link
          href="/collections"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          View all
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {collections.map((collection) => (
          <Link
            key={collection.id}
            href={`/collections/${collection.id}`}
            style={collection.dominantColor ? { borderColor: `${collection.dominantColor}66` } : undefined}
            className="group flex flex-col rounded-lg border bg-card p-4 hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <h3 className="font-medium text-sm leading-snug">{collection.name}</h3>
              {collection.isFavorite && (
                <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400 shrink-0 mt-0.5" />
              )}
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2 flex-1">
              {collection.description}
            </p>
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-1">
                {collection.types.map(({ name, icon, color }) => {
                  const Icon = icon ? (iconMap[icon] ?? File) : File
                  return (
                    <div
                      key={name}
                      className="w-5 h-5 rounded flex items-center justify-center"
                      style={{ backgroundColor: `${color}22` }}
                      title={name}
                    >
                      <Icon className="w-3 h-3" style={{ color }} />
                    </div>
                  )
                })}
              </div>
              <p className="text-xs text-muted-foreground">
                {collection.itemCount} {collection.itemCount === 1 ? 'item' : 'items'}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
