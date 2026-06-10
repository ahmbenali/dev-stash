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
  Settings,
  ChevronDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CollectionWithMeta } from '@/lib/db/collections'
import type { ItemTypeWithCount } from '@/lib/db/items'

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
  itemTypes: ItemTypeWithCount[]
  favoriteCollections: CollectionWithMeta[]
  recentCollections: CollectionWithMeta[]
}

export default function Sidebar({
  collapsed,
  mobileOpen,
  itemTypes,
  favoriteCollections,
  recentCollections,
}: SidebarProps) {
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
          itemTypes={itemTypes}
          favoriteCollections={favoriteCollections}
          recentCollections={recentCollections}
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
          itemTypes={itemTypes}
          favoriteCollections={favoriteCollections}
          recentCollections={recentCollections}
        />
      </aside>
    </>
  )
}

interface SidebarContentProps {
  collapsed: boolean
  itemTypes: ItemTypeWithCount[]
  favoriteCollections: CollectionWithMeta[]
  recentCollections: CollectionWithMeta[]
}

function SidebarContent({
  collapsed,
  itemTypes,
  favoriteCollections,
  recentCollections,
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
            {itemTypes.map((type) => {
              const Icon = iconMap[type.icon ?? ''] ?? File
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
                    style={{ color: type.color ?? undefined }}
                  />
                  {!collapsed && (
                    <>
                      <span className="flex-1 capitalize">{type.name}s</span>
                      <span className="text-xs tabular-nums">{type.count}</span>
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
                      <Star className="w-3 h-3 shrink-0 fill-yellow-400 text-yellow-400" />
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
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{
                          backgroundColor: collection.dominantColor ?? '#6b7280',
                        }}
                      />
                      <span className="flex-1 truncate">{collection.name}</span>
                      <span className="text-xs tabular-nums">{collection.itemCount}</span>
                    </Link>
                  ))}
                </nav>
              )}
            </div>

            {/* View all collections */}
            <Link
              href="/collections"
              className="flex items-center px-2 py-1.5 mt-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              View all collections →
            </Link>
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
          <span className="text-primary-foreground text-xs font-semibold">JD</span>
        </div>
        {!collapsed && (
          <>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">John Doe</p>
              <p className="text-xs text-muted-foreground truncate">demo@devstash.io</p>
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
