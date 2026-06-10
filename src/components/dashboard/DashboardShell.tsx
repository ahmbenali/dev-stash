'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FolderPlus, PanelLeft, Plus, Search } from 'lucide-react'
import Sidebar from './Sidebar'
import type { CollectionWithMeta } from '@/lib/db/collections'
import type { ItemTypeWithCount } from '@/lib/db/items'

interface DashboardShellProps {
  children: React.ReactNode
  itemTypes: ItemTypeWithCount[]
  favoriteCollections: CollectionWithMeta[]
  recentCollections: CollectionWithMeta[]
}

export default function DashboardShell({
  children,
  itemTypes,
  favoriteCollections,
  recentCollections,
}: DashboardShellProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleToggle = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setMobileOpen((prev) => !prev)
    } else {
      setCollapsed((prev) => !prev)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      {/* Top bar */}
      <header className="flex items-center gap-4 px-4 h-14 border-b border-border shrink-0">
        <div className="flex items-center gap-2 w-44 shrink-0">
          <button
            onClick={handleToggle}
            className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Toggle sidebar"
          >
            <PanelLeft className="w-4 h-4" />
          </button>
          <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
            <span className="text-primary-foreground text-xs font-bold">D</span>
          </div>
          <span className="font-semibold text-sm tracking-tight">devstash</span>
        </div>

        <div className="flex-1 max-w-md mx-auto relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search items..."
            className="pl-9 pr-16 bg-muted border-0 focus-visible:ring-1"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground bg-background border border-border rounded px-1.5 py-0.5">
            ⌘K
          </kbd>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <Button variant="outline" size="sm" className="gap-1.5">
            <FolderPlus className="w-4 h-4" />
            New Collection
          </Button>
          <Button size="sm" className="gap-1.5">
            <Plus className="w-4 h-4" />
            New Item
          </Button>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Mobile overlay */}
        {mobileOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/50 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        <Sidebar
          collapsed={collapsed}
          mobileOpen={mobileOpen}
          itemTypes={itemTypes}
          favoriteCollections={favoriteCollections}
          recentCollections={recentCollections}
        />

        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
