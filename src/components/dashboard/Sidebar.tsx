'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  File,
  Image,
  Link as LinkIcon,
  Star,
  Clock,
  Settings,
  ChevronDown,
} from 'lucide-react'
import {
  mockCollections,
  mockItemTypeCounts,
  mockItemTypes,
  mockUser,
} from '@/lib/mock-data'
import { cn } from '@/lib/utils'

const iconMap: Record<string, React.ElementType> = {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  File,
  Image,
  Link: LinkIcon,
}

interface SidebarProps {
  collapsed: boolean
  mobileOpen: boolean
}

export default function Sidebar({ collapsed, mobileOpen }: SidebarProps) {
  const favoriteCollections = mockCollections.filter((c) => c.isFavorite)
  const recentCollections = mockCollections
    .filter((c) => !c.isFavorite)
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 5)

  const userInitials = mockUser.name
    .split(' ')
    .map((n) => n[0])
    .join('')

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          'hidden md:flex flex-col border-r border-border shrink-0 transition-all duration-200 overflow-hidden',
          collapsed ? 'w-14' : 'w-60'
        )}
      >
        <SidebarContent
          collapsed={collapsed}
          favoriteCollections={favoriteCollections}
          recentCollections={recentCollections}
          userInitials={userInitials}
        />
      </aside>

      {/* Mobile drawer */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-30 flex flex-col w-64 bg-background border-r border-border transition-transform duration-200 md:hidden',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <SidebarContent
          collapsed={false}
          favoriteCollections={favoriteCollections}
          recentCollections={recentCollections}
          userInitials={userInitials}
        />
      </aside>
    </>
  )
}

interface SidebarContentProps {
  collapsed: boolean
  favoriteCollections: typeof mockCollections
  recentCollections: typeof mockCollections
  userInitials: string
}

function SidebarContent({
  collapsed,
  favoriteCollections,
  recentCollections,
  userInitials,
}: SidebarContentProps) {
  const [favOpen, setFavOpen] = useState(true)
  const [recentOpen, setRecentOpen] = useState(true)

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto py-3 px-2">
        {/* Types section */}
        <div className="mb-4">
          {!collapsed && (
            <p className="px-2 mb-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Types
            </p>
          )}
          <nav className="space-y-0.5">
            {mockItemTypes.map((type) => {
              const Icon = iconMap[type.icon] ?? File
              const count =
                mockItemTypeCounts[
                  type.name as keyof typeof mockItemTypeCounts
                ]
              return (
                <Link
                  key={type.id}
                  href={`/items/${type.name}s`}
                  className={cn(
                    'flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors',
                    collapsed && 'justify-center px-2'
                  )}
                  title={collapsed ? type.name : undefined}
                >
                  <Icon
                    className="w-4 h-4 shrink-0"
                    style={{ color: type.color }}
                  />
                  {!collapsed && (
                    <>
                      <span className="flex-1 capitalize">{type.name}s</span>
                      <span className="text-xs tabular-nums">{count}</span>
                    </>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Collections section */}
        {!collapsed && (
          <div>
            <p className="px-2 mb-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Collections
            </p>

            {/* Favorites */}
            <div className="mb-3">
              <button
                onClick={() => setFavOpen((o) => !o)}
                className="flex items-center gap-1.5 w-full px-2 py-1 hover:text-foreground transition-colors"
              >
                <Star className="w-3 h-3 text-muted-foreground fill-current" />
                <span className="flex-1 text-left text-xs text-muted-foreground font-medium">
                  Favorites
                </span>
                <ChevronDown
                  className={cn(
                    'w-3 h-3 text-muted-foreground transition-transform duration-150',
                    !favOpen && '-rotate-90'
                  )}
                />
              </button>
              {favOpen && (
                <nav className="space-y-0.5">
                  {favoriteCollections.map((collection) => (
                    <Link
                      key={collection.id}
                      href={`/collections/${collection.id}`}
                      className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    >
                      <span className="flex-1 truncate">{collection.name}</span>
                      <span className="text-xs tabular-nums">{collection.itemCount}</span>
                    </Link>
                  ))}
                </nav>
              )}
            </div>

            {/* Recent */}
            <div>
              <button
                onClick={() => setRecentOpen((o) => !o)}
                className="flex items-center gap-1.5 w-full px-2 py-1 hover:text-foreground transition-colors"
              >
                <Clock className="w-3 h-3 text-muted-foreground" />
                <span className="flex-1 text-left text-xs text-muted-foreground font-medium">
                  Recent
                </span>
                <ChevronDown
                  className={cn(
                    'w-3 h-3 text-muted-foreground transition-transform duration-150',
                    !recentOpen && '-rotate-90'
                  )}
                />
              </button>
              {recentOpen && (
                <nav className="space-y-0.5">
                  {recentCollections.map((collection) => (
                    <Link
                      key={collection.id}
                      href={`/collections/${collection.id}`}
                      className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    >
                      <span className="flex-1 truncate">{collection.name}</span>
                      <span className="text-xs tabular-nums">{collection.itemCount}</span>
                    </Link>
                  ))}
                </nav>
              )}
            </div>
          </div>
        )}
      </div>

      {/* User area */}
      <div
        className={cn(
          'border-t border-border p-3',
          collapsed ? 'flex justify-center' : 'flex items-center gap-2.5'
        )}
      >
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
          <span className="text-primary-foreground text-xs font-semibold">
            {userInitials}
          </span>
        </div>
        {!collapsed && (
          <>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{mockUser.name}</p>
              <p className="text-xs text-muted-foreground truncate">
                {mockUser.email}
              </p>
            </div>
            <button
              className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors shrink-0"
              aria-label="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </div>
  )
}
