import { getListings } from '@/actions/listing'
import { Home, Users, DollarSign } from 'lucide-react'
import Link from 'next/link'
import StatsCard from './stats-card'
import ListingCard from './listing-card'
import styles from './dashboard.module.css'

export default async function DashboardPage() {
    const { listings, error } = await getListings();

    let active = [];
    if (listings?.length > 0) {
        // Correct the property name and check the boolean value directly
        active = listings.filter(listing => listing.availability_status === true);
    }

    const stats = {
        totalListings: listings?.length || 0,
        activeBookings: active.length, // This would come from a bookings API
        totalEarnings: 12450 // This would come from an earnings API
    };

    // You can log or return the stats as needed
    console.log(stats);

    return (
        <div className={styles.container}>
        <div className={styles.header}>
            <h1>Dashboard</h1>
            <Link href="/eazystay/protected/listings/new" className={styles.addButton}>
            + Add New Listing
            </Link>
        </div>

        <div className={styles.stats}>
            <StatsCard
            title="Total Listings"
            value={stats.totalListings}
            icon={<Home />}
            />
            <StatsCard
            title="Active Bookings"
            value={stats.activeBookings}
            icon={<Users />}
            />
            <StatsCard
            title="Total Earnings"
            value={`$${stats.totalEarnings.toLocaleString()}`}
            icon={<DollarSign />}
            />
        </div>

        {error ? (
            <div className={styles.error}>
            {error}
            </div>
        ) : (
            <div className={styles.listings}>
            <h2>Your Listings</h2>
            {listings?.length > 0 ? (
                <div className={styles.listingsGrid}>
                {listings.map(listing => (
                    <ListingCard key={listing.id} listing={listing} />
                ))}
                </div>
            ) : (
                <div className={styles.empty}>
                No listings found. Create your first listing!
                </div>
            )}
            </div>
        )}
        </div>
    )
}

