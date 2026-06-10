import DashboardShell from '@/components/dashboard/DashboardShell'
import { getFavoriteCollections, getRecentCollections } from '@/lib/db/collections'
import { getItemTypesWithCounts } from '@/lib/db/items'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [itemTypes, favoriteCollections, recentCollections] = await Promise.all([
    getItemTypesWithCounts(),
    getFavoriteCollections(),
    getRecentCollections(5),
  ])

  return (
    <DashboardShell
      itemTypes={itemTypes}
      favoriteCollections={favoriteCollections}
      recentCollections={recentCollections}
    >
      {children}
    </DashboardShell>
  )
}
