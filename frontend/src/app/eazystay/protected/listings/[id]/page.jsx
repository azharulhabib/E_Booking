import { getRentalListings } from '../../actions/listings';
import '../../styles/listings.css';

export default async function ListingDetails({ params }) {
  const listings = await getRentalListings();
  const listing = listings.find(l => l.slug === params.slug);

  if (!listing) {
    return <div>Listing not found</div>;
  }

  return (
    <div className="container" style={{ padding: '2rem' }}>
      <h1 className="listing-title">{listing.title}</h1>
      
      <div style={{ marginTop: '2rem' }}>
        <h2>Property Details</h2>
        <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
          <p><strong>Price:</strong> ${Math.abs(listing.price)}/month</p>
          <p><strong>Availability:</strong> {listing.availability_status ? 'Available' : 'Not Available'}</p>
          <p><strong>City:</strong> {listing.city}</p>
          <p><strong>Floor:</strong> {listing.floor}</p>
          <p><strong>Home Size:</strong> {listing.home_size} sqft</p>
          <p><strong>Booking Schedule:</strong> {new Date(listing.booking_schedule).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}

