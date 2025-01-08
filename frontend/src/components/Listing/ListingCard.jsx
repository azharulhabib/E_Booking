import Link from 'next/link';
import styles from './ListingCard.module.css';

export default function ListingCard({ listing }) {
  return (
    <div className={styles.listingCard}>
      <h2 className={styles.listingTitle}>{listing.title}</h2>
      <div className={styles.listingDetails}>
        <span>{listing.home_size} sqft</span>
        <span>{listing.floor} floor</span>
      </div>
      <div className={styles.listingLocation}>
        <span>📍 {listing.city}</span>
      </div>
      <div className={styles.listingAvailability}>
        {listing.availability_status ? 'Available' : 'Not Available'}
      </div>
      <div className={styles.listingPrice}>
        <div>
          <span className={styles.priceAmount}>${Math.abs(listing.price)}</span>
          <span className={styles.pricePeriod}>/month</span>
        </div>
        <Link href={`/eazystay/protected/listings/${listing.id}`} className={styles.viewDetailsBtn}>
          View Details
        </Link>
      </div>
    </div>
  );
};

