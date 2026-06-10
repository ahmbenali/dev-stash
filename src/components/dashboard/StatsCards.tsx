import { getItemStats } from '@/lib/db/items'
import { Archive, BookMarked, FolderOpen, Star } from 'lucide-react'

export default async function StatsCards() {
  const { totalItems, totalCollections, favoriteItems, favoriteCollections } =
    await getItemStats()

  const stats = [
    { label: 'Items', value: totalItems, Icon: Archive, iconClass: 'text-blue-400' },
    { label: 'Collections', value: totalCollections, Icon: FolderOpen, iconClass: 'text-purple-400' },
    { label: 'Favorite Items', value: favoriteItems, Icon: Star, iconClass: 'text-yellow-400' },
    { label: 'Favorite Collections', value: favoriteCollections, Icon: BookMarked, iconClass: 'text-emerald-400' },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map(({ label, value, Icon, iconClass }) => (
        <div key={label} className="rounded-lg border border-border bg-card p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{label}</span>
            <Icon className={`w-4 h-4 ${iconClass}`} />
          </div>
          <p className="text-2xl font-semibold tabular-nums">{value}</p>
        </div>
      ))}
    </div>
  )
}
