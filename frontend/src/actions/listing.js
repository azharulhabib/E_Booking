'use server'

import { getRentalListings, createRentalListing, deleteRentalListing, updateRentalListing } from '@/libs/api'

export async function getListings() {
  try {
    const listings = await getRentalListings()
    return { listings }
  } catch (error) {
    return { error: 'Failed to fetch listings' }
  }
}

export async function deleteListing(id) {
  try {
    await deleteRentalListing(id)
    return { success: true }
  } catch (error) {
    return { error: 'Failed to delete listing' }
  }
}

export async function updateListing(listing) {
  try {
    await updateRentalListing(listing)
    return { success: true }
  } catch (error) {
    return { error: 'Failed to update listing' }
  }
}

export async function saveListing(formData) {
  try {
    const listingData = {
      title: formData.get('title'),
      description: formData.get('description'),
      price: formData.get('price'),
      address: formData.get('address'),
      city: formData.get('city'),
      state: formData.get('state'),
      booking_schedule: formData.get('booking_schedule'),
      home_size: formData.get('home_size'),
      floor: formData.get('floor'),
    }

    if (formData.get('id')) {
      listingData.id = formData.get('id')
      await updateRentalListing(listingData)
    } else {
      await createRentalListing(listingData)
    }

    return { success: true }
  } catch (error) {
    return { error: error.message }
  }
}

