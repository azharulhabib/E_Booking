import { getRentalListingById } from '@/libs/api'
import ListingForm from '../../listing-form'

export default async function EditListingPage({ params }) {
  const listing = await getRentalListingById(params.id)
  return <ListingForm initialData={listing} />
}

