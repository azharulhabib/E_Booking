import { getRentalListingById } from '@/libs/api'
import ListingForm from '../../listing-form'

export default async function EditListingPage({ params }) {
  const params_obj = await params
  const id = params_obj.id
  const listing = await getRentalListingById(id)
  return <ListingForm initialData={listing} />
}

