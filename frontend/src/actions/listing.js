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

export async function saveListing(data) {
  try {
    if (data.id) {
      const response = await updateRentalListing(data)
      if (response.status) {
        return { error: 'Failed to update listing' }
      }
      return { id: response.id, success: true }
    } else {
      const response = await createRentalListing(data)
      if (response.status) {
        return { error: 'Failed to create listing' }
      }
      return { id: response.id, success: true }
    }

  } catch (error) {
    return { error: error.message }
  }
}

