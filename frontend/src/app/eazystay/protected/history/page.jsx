'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getBooking } from '@/actions/booking';
import { getListingById, updateListing } from '@/actions/listing';
import { retrieveUserRole } from '@/actions/login';
import { updateBooking, updateRelatedBookings } from '@/actions/booking';
import styles from './history.module.css';

export default function History() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState(null);
    const [updating, setUpdating] = useState(null);
  
    useEffect(() => {
      async function fetchBookings() {
        try {
          const role = await retrieveUserRole();
          setUserRole(role);
          const bookingHistory = await getBooking();
          
          const listingsPromises = bookingHistory.map(booking => 
            getListingById(booking.listing)
          );
          
          const listingsDetails = await Promise.all(listingsPromises);
          
          const bookingsWithDetails = bookingHistory.map((booking, index) => ({
            ...booking,
            listing: listingsDetails[index].listing
          }));
          
          setBookings(bookingsWithDetails);
        } catch (error) {
          console.error('Error fetching bookings:', error);
        } finally {
          setLoading(false);
        }
      }
  
      fetchBookings();
    }, []);
  
    const handleUpdateStatus = async (bookingId, listingId, status) => {
      try {
        setUpdating(bookingId);
        
        // Update the current booking
        await updateBooking({
          id: bookingId,
          booked_status: status
        });
  
        console.log('updated status', status);
        // If accepting, update other pending bookings for this listing to rejected
        if (status === 'accepted') {
          await updateListing({ id:listingId, availability_status:false })
          await updateRelatedBookings(bookingId, listingId);
        }
  
        // Update local state
        setBookings(prevBookings => 
          prevBookings.map(booking => {
            if (booking.id === bookingId) {
              return { ...booking, booked_status: status };
            }
            if (status === 'accepted' && booking.listing.id === listingId) {
              return { ...booking, booked_status: 'rejected' };
            }
            return booking;
          })
        );
      } catch (error) {
        console.error('Error updating booking:', error);
      } finally {
        setUpdating(null);
      }
    };
  
    if (loading) {
      return <div className={styles.historyPage}>Loading...</div>;
    }
  
    return (
      <div className={styles.historyPage}>
        <h1 className={styles.title}>Your Listings</h1>
        
        <div className={styles.listingsList}>
          {bookings.map((booking) => (
            <div key={booking.id} className={styles.listingCard}>
              <div className={styles.listingInfo}>
                <h2>{booking.listing.title}</h2>
                <div className={styles.listingDetails}>
                  {booking.listing.home_size} sq ft
                </div>
                <div className={styles.location}>
                  {booking.listing.city}, {booking.listing.state}
                </div>
                <div className={styles.price}>
                  ${Math.abs(booking.listing.price)}
                </div>
                <Link 
                    href={`/eazystay/protected/listings/${booking.listing.id}`}
                    className={styles.viewDetailButton}
                    >
                    View Details
                </Link>
                
                {console.log('userRole', userRole)}
                {userRole === 'Owner' && booking.booked_status === 'pending' && (
                  <div className={styles.actionButtons}>
                    <button
                      className={styles.acceptButton}
                      onClick={() => handleUpdateStatus(booking.id, booking.listing.id, 'accepted')}
                      disabled={updating === booking.id}
                    >
                      {updating === booking.id ? 'Updating...' : 'Accept'}
                    </button>
                    <button
                      className={styles.rejectButton}
                      onClick={() => handleUpdateStatus(booking.id, booking.listing.id, 'rejected')}
                      disabled={updating === booking.id}
                    >
                      {updating === booking.id ? 'Updating...' : 'Reject'}
                    </button>
                  </div>
                )}
              </div>
              <div 
                className={`${styles.status} ${
                  booking.booked_status === 'accepted'
                    ? styles.statusAccepted
                    : booking.booked_status === 'rejected'
                    ? styles.statusRejected
                    : styles.statusPending
                }`}
              >
                {booking.booked_status}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }




