'use server'

import { getRentalListings, getRentalListingById, createRentalListing, deleteRentalListing, updateRentalListing } from '@/libs/api'
import { getAccessToken } from '@/libs/api'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function getListings() {
  try {
    const listings = await getRentalListings()
    return { listings }
  } catch (error) {
    return { error: 'Failed to fetch listings' }
  };
};

export async function getListingById(id) {
  try {
    const listing = await getRentalListingById(id)
    return { listing }
  } catch (error) {
    return { error: 'Failed to fetch listing' }
  };
};

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

export async function getRentalImages(listingId) {
  try {
    const accessToken = await getAccessToken();
    const response = await fetch(`${API_BASE_URL}/rental-images/?listing=${listingId}`, {
      method: 'GET',
      cache: 'no-store',
      headers: {
        'Authorization': `Bearer ${accessToken}`, // Add the Authorization header
      },
    });

    if (!response.ok) {
      console.log('Error fetching images')
    };

    const data = await response.json();
    return data.images || [];
  } catch (error) {
    console.error('Error fetching images:', error);
    return [];
  };
};

export async function getUtilityBillImages(listingId) {
  try {
    const accessToken = await getAccessToken();
    const response = await fetch(`${API_BASE_URL}/utility-bill-images/?listing=${listingId}`, {
      method: 'GET',
      cache: 'no-store',
      headers: {
        'Authorization': `Bearer ${accessToken}`, // Add the Authorization header
      },
    });
    
    if (!response.ok) {
      console.log('Error fetching images')
    };
    
    const data = await response.json();
    return data.images || [];
  } catch (error) {
    console.error('Error fetching utility bill images:', error);
    return [];
  };
};

export async function updateListingStatus(listing, status) {
  try {
    const updatedListing = {
      ...listing,
      approved: status,
      availability_status: status === 'accepted'
    };

    await updateRentalListing(updatedListing);
    return { success: true };
  } catch (error) {
    return { error: 'Failed to update listing status' };
  };
};

