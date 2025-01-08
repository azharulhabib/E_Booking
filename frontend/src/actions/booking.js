'use server'
import { getBookingHistory, postBookingHistory, updateBookingHistory } from "@/libs/api";

export async function postBooking(listingId, ownerId, bookingSchedule) {
  const data = {
    listing: listingId,
    owner: ownerId,
    start_date: bookingSchedule
  }
  try {
    const response = await postBookingHistory(data);

    return response;
  } catch (error) {
    console.error('Error creating booking:', error);
    return { error: 'Error creating booking' }
  };
};

export async function getBooking() {
  try {
    const response = await getBookingHistory();
    
    if (!response) {
      throw new Error('Failed to fetch booking history');
    }
    
    return response;
  } catch (error) {
    console.error('Error fetching booking history:', error);
    return [];
  };
};

export async function updateBooking(data) {
  try {
    const response = await updateBookingHistory(data);

    if (!response) {
      return { error: 'Error updating booking' }
    }
  } catch (error) {
    console.error('Error updating booking:', error);
    return { error: 'Error updating booking' }
  }
}

export async function updateRelatedBookings(currentBookingId, listingId) {
  try {
    // Get all bookings for this listing
    const response = await getBookingHistory();

    if (!response) {
      return;
    }

    // Filter bookings for the same listing that are pending and not the current booking
    const relatedBookings = response.filter(booking => 
      booking.listing === listingId && 
      booking.id !== currentBookingId && 
      booking.booked_status === 'pending'
    );

    // Update all related bookings to rejected
    const updatePromises = relatedBookings.map(booking => 
      updateBooking({
        id: booking.id,
        booked_status: 'rejected'
      })
    );

    await Promise.all(updatePromises);
  } catch (error) {
    console.error('Error updating related bookings:', error);
  }
}

