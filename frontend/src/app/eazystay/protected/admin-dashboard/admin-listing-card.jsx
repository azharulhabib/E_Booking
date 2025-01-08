'use client'

import { useState } from 'react'
import { updateListingStatus } from '@/actions/listing'
import { useRouter } from 'next/navigation'
import ImageModal from '@/components/Admin-Dashboard/image-modal'
import styles from './admin-dashboard.module.css'

export default function AdminListingCard({ listing, utilityBillImage }) {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [updating, setUpdating] = useState(false)
  const baseImgUrl = process.env.NEXT_PUBLIC_MEDIA_BASE_URL

  async function handleStatusUpdate(status) {
    if (confirm(`Are you sure you want to ${status} this listing?`)) {
      setUpdating(true)
      const result = await updateListingStatus(listing, status)
      setUpdating(false)
      if (result.success) {
        router.refresh()
      }
    }
  }

  return (
    <div className={styles.listingCard}>
      <div className={styles.utilityBillSection}>
        {utilityBillImage && (
          <img
            src={baseImgUrl + utilityBillImage.image}
            alt="Utility Bill"
            className={styles.utilityBillThumb}
            onClick={() => setIsModalOpen(true)}
          />
        )}
      </div>
      
      <div className={styles.listingInfo}>
        <h3>{listing.title}</h3>
        <p>{listing.description}</p>
        <div className={styles.listingDetails}>
          <span>{listing.city}, {listing.state}</span>
          <span>•</span>
          <span>${Math.abs(listing.price)}</span>
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
      
      {listing.approved === 'pending' && (
        <div className={styles.listingActions}>
          <button 
            onClick={() => handleStatusUpdate('accepted')}
            className={`${styles.button} ${styles.acceptButton}`}
            disabled={updating}
          >
            {updating ? 'Updating...' : 'Accept'}
          </button>
          <button 
            onClick={() => handleStatusUpdate('rejected')}
            className={`${styles.button} ${styles.rejectButton}`}
            disabled={updating}
          >
            {updating ? 'Updating...' : 'Reject'}
          </button>
        </div>
      )}

      {isModalOpen && (
        <ImageModal 
          image={baseImgUrl + utilityBillImage.image}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  )
}

