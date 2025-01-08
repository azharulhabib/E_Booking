'use client'

import { deleteListing } from '@/actions/listing'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import styles from './dashboard.module.css'

export default function ListingCard({ listing }) {
  const router = useRouter()

  async function handleDelete() {
    if (confirm('Are you sure you want to delete this listing?')) {
      const result = await deleteListing(listing.id)
      if (result.success) {
        router.refresh()
      }
    }
  }

  return (
    <div className={styles.listingCard}>
      
      <div className={styles.listingInfo}>
        <h3>{listing.title}</h3>
        <p>{listing.description}</p>
        <div className={styles.listingDetails}>
          <span>{listing.city}, {listing.state}</span>
          <span>•</span>
          <span>${listing.price}</span>
          <span>•</span>
          <span>{listing.home_size} sq ft</span>
        </div>
      </div>
      
      <div className={styles.listingStatus}>
        <span className={`${styles.badge} ${styles[listing.approved]}`}>
          {listing.approved}
        </span>
        <span className={`${styles.badge} ${listing.availability_status ? styles.available : styles.unavailable}`}>
          {listing.availability_status ? 'Available' : 'Unavailable'}
        </span>
      </div>
      
      <div className={styles.listingActions}>
        {listing.approved !== 'rejected' &&
        <Link 
          href={`/eazystay/protected/listings/${listing.id}/edit`}
          className={`${styles.button} ${styles.editButton}`}
        >
          Edit
        </Link>
        }
        <button 
          onClick={handleDelete}
          className={`${styles.button} ${styles.deleteButton}`}
        >
          Delete
        </button>
      </div>
    </div>
  )
}

