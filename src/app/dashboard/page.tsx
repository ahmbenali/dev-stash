import DashboardCollections from '@/components/dashboard/DashboardCollections'
import PinnedItems from '@/components/dashboard/PinnedItems'
import RecentItems from '@/components/dashboard/RecentItems'
import StatsCards from '@/components/dashboard/StatsCards'

export default function DashboardPage() {
  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Your developer knowledge hub
        </p>
      </div>
      <StatsCards />
      <DashboardCollections />
      <PinnedItems />
      <RecentItems />
    </div>
  )
}
