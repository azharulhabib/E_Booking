import { getListings, getUtilityBillImages } from '@/actions/listing'
import { Home, Users, CheckCircle } from 'lucide-react'
import StatsCard from '../owner-dashboard/stats-card'
import AdminListingCard from './admin-listing-card'
import styles from './admin-dashboard.module.css'

export default async function AdminDashboardPage() {
  const { listings, error } = await getListings()

  // Get utility bill images for each listing
  const listingsWithImages = await Promise.all(
    (listings || []).map(async (listing) => {
      const images = await getUtilityBillImages(listing.id)
      return {
        ...listing,
        utilityBillImage: images[0] // Get first image if exists
      }
    })
  )

  const stats = {
    totalListings: listings?.length || 0,
    pendingApprovals: listings?.filter(l => l.approved === 'pending').length || 0,
    approvedListings: listings?.filter(l => l.approved === 'accepted').length || 0
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Admin Dashboard</h1>
      </div>

      <div className={styles.stats}>
        <StatsCard
          title="Total Listings"
          value={stats.totalListings}
          icon={<Home />}
        />
        <StatsCard
          title="Pending Approvals"
          value={stats.pendingApprovals}
          icon={<Users />}
        />
        <StatsCard
          title="Approved Listings"
          value={stats.approvedListings}
          icon={<CheckCircle />}
        />
      </div>

      {error ? (
        <div className={styles.error}>
          {error}
        </div>
      ) : (
        <div className={styles.listings}>
          <h2>Listings</h2>
          {listingsWithImages?.length > 0 ? (
            <div className={styles.listingsGrid}>
              {listingsWithImages.map(listing => (
                <AdminListingCard 
                  key={listing.id} 
                  listing={listing}
                  utilityBillImage={listing.utilityBillImage}
                />
              ))}
            </div>
          ) : (
            <div className={styles.empty}>
              No listings found.
            </div>
          )}
        </div>
      )}
    </div>
  )
}

