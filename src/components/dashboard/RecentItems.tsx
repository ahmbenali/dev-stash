import { Clock, Code, File, Image, Link as LinkIcon, Sparkles, StickyNote, Terminal } from 'lucide-react'
import { mockItems, mockItemTypes } from '@/lib/mock-data'

const iconMap: Record<string, React.ElementType> = {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  File,
  Image,
  Link: LinkIcon,
}

function getTypeInfo(itemTypeId: string) {
  const type = mockItemTypes.find((t) => t.id === itemTypeId)
  if (!type) return { Icon: File, color: '#6b7280' }
  return { Icon: iconMap[type.icon] ?? File, color: type.color }
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function RecentItems() {
  const recent = [...mockItems]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 10)

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-4 h-4 text-muted-foreground" />
        <h2 className="text-base font-semibold">Recent Items</h2>
      </div>
      <div className="space-y-3">
        {recent.map((item) => {
          const { Icon, color } = getTypeInfo(item.itemTypeId)
          return (
            <div
              key={item.id}
              className="flex items-start gap-3 rounded-lg border border-border bg-card p-4"
            >
              <div
                className="w-8 h-8 rounded-md flex items-center justify-center shrink-0 mt-0.5"
                style={{ backgroundColor: `${color}22` }}
              >
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium text-sm leading-snug">{item.title}</p>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {formatDate(item.createdAt)}
                  </span>
                </div>
                {item.description && (
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                    {item.description}
                  </p>
                )}
                {item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
