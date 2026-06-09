import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FolderPlus, Plus, Search } from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      {/* Top bar */}
      <header className="flex items-center gap-4 px-4 h-14 border-b border-border shrink-0">
        <div className="flex items-center gap-2 w-40 shrink-0">
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
        {/* Sidebar placeholder */}
        <aside className="w-64 border-r border-border shrink-0 p-4">
          <h2 className="text-muted-foreground font-medium">Sidebar</h2>
        </aside>

        {/* Main area */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
