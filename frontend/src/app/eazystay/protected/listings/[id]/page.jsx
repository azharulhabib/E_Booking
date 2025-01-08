'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getListingById, getRentalImages } from '@/actions/listing';
import { postBooking } from '@/actions/booking';
import { retrieveUserRole } from '@/actions/login';
import styles from './listing-detail.module.css';

export default function ListingDetails({ params }) {
  const router = useRouter();
  const [listing, setListing] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const baseImgUrl = process.env.NEXT_PUBLIC_MEDIA_BASE_URL;
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const params_obj = await params
        const userRole = await retrieveUserRole();
        setUserRole(userRole);
        const id = params_obj.id
        const listingData = await getListingById(id);
        if (listingData) {
          setListing(listingData.listing);
          const imagesData = await getRentalImages(listingData.listing.id);
          console.log('imagesData', imagesData);
          setImages(imagesData);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [params.slug]);

  const handleBooking = async (e) => {
    e.preventDefault();
    try {
      setBooking(true);
      const response = await postBooking(listing.id, listing.owner, listing.booking_schedule);
      console.log('listing booking', response);
      if (response.error) {
        console.error('Error booking:', response.error);
        return;
      }
      router.push('/eazystay/protected/history');
    } catch (error) {
      console.error('Error booking:', error);
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return <div className={styles.detailPage}>Loading...</div>;
  }

  if (!listing) {
    return <div className={styles.detailPage}>Listing not found</div>;
  }

  return (
    <div className={styles.detailPage}>
      <div className={styles.imageGallery}>
        <div className={styles.mainImage}>
          {images.length > 0 && 
            <>
              <img src={baseImgUrl + images[0].image} alt={listing.title} />
            </>
          }
        </div>
        <div className={styles.thumbnailGrid}>
          {images.slice(1).map((image, index) => (
            <div key={index} className={styles.thumbnail}>
              <img src={baseImgUrl +image.image} alt={image.alt_text || `${listing.title} - ${index + 2}`} />
            </div>
          ))}
        </div>
      </div>

      <div className={styles.contentGrid}>
        <div className={styles.listingInfo}>
          <h1>{listing.title}</h1>
          <div className={styles.location}>{listing.city}, {listing.state}</div>
          <div className={styles.details}>
            <span>{listing.home_size} sq.ft</span>
            <span>{listing.floor} floor</span>
          </div>

          <div className={styles.description}>
            <h2>Description</h2>
            <p>{listing.description}</p>
          </div>
        </div>

        <div className={styles.bookingInfo}>
          <div className={styles.price}>
            ${Math.abs(listing.price)} / Month
          </div>

          <div className={styles.bookingSchedule}>
            <h3>Booking Schedule</h3>
            <div>{new Date(listing.booking_schedule).toLocaleDateString()}</div>
          </div>

          <div className={styles.utilities}>
            <p>All utilities are included</p>
          </div>

          { (userRole === "Customer") &&
            listing.availability_status &&
            <button 
              className={styles.bookButton}
              onClick={handleBooking}
              disabled={booking}
            >
              {booking ? 'Booking...' : 'Book'}
            </button>
          }

          <p className={styles.disclaimer}>
            Your booking will only be confirmed after the owner's approval. 
            Without approval, the booking is not finalized.
          </p>
        </div>
      </div>
    </div>
  );
};

