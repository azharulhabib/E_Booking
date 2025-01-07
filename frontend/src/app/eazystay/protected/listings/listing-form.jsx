'use client'

import { useState } from 'react'
import { retrieveAccessToken } from '@/actions/login'
import { useRouter } from 'next/navigation'
import { saveListing } from '@/actions/listing'
import styles from './listing-form.module.css'

export default function ListingForm({ initialData }) {
  const router = useRouter();
  const [listing_id, setListingId] = useState(null);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(initialData || {
    title: '',
    description: '',
    price: '',
    address: '',
    city: '',
    state: '',
    booking_schedule: '',
    home_size: '',
    floor: '',
  });
  const [rentalImage, setRentalImage] = useState(null);
  const [utilityImage, setUtilityImage] = useState(null);

  async function handleBasicInfoSubmit(e) {
    e.preventDefault();
    const initial_data = new FormData(e.target);
    const id = initialData ? initialData.id : null;
    const title = initial_data.get('title');
    const description = initial_data.get('description');
    const price = initial_data.get('price');
    const address = initial_data.get('address');
    const city = initial_data.get('city');
    const state = initial_data.get('state');
    const booking_schedule = initial_data.get('booking_schedule');
    const home_size = initial_data.get('home_size');
    const floor = initial_data.get('floor');

    const data = {}

    if (id) {
      data.id = id;
    };

    if (title) {
      data.title = title;
    };

    if (description) {
      data.description = description;
    };

    if (price) {
      data.price = price;
    };

    if (address) {
      data.address = address;
    };

    if (city) {
      data.city = city;
    };

    if (state) {
      data.state = state;
    };

    if (booking_schedule) {
      data.booking_schedule = booking_schedule;
    };

    if (home_size) {
      data.home_size = home_size;
    };

    if (floor) {
      data.floor = floor;
    };

    const result = await saveListing(data)
    if (result.success) {
        setListingId(result.id);
        setStep(2);
    };
  };

  async function handleRentalImageSubmit(e) {
    e.preventDefault();
    const accessToken = await retrieveAccessToken();
    const formData = new FormData();
    formData.append('listing', listing_id);
    formData.append('image', rentalImage);
    
    try {
      const response = await fetch(`${API_BASE_URL}/rental-images/upload/`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${accessToken}`, // Add the Authorization header
        },
      });

      if (response.ok) {
        setStep(3)
      };
    } catch (error) {
      console.error('Error uploading rental image:', error)
    };
  };

  async function handleUtilityImageSubmit(e) {
    e.preventDefault();
    const accessToken = await retrieveAccessToken();
    const formData = new FormData();
    console.log('accessToken', accessToken);
    console.log('listing_id', listing_id);
    formData.append('listing', listing_id);
    formData.append('image', utilityImage);
    
    try {
      const response = await fetch(`${API_BASE_URL}/utility-bill-images/upload/`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${accessToken}`, // Add the Authorization header
        },
      });
    } catch (error) {
      console.error('Error uploading utility image:', error)
    };
  };

  async function handleCompleteSubmit(e) {
    e.preventDefault();
    router.push('/eazystay/protected/dashboard')
  };

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <div className={styles.steps}>
          <div className={`${styles.step} ${step >= 1 ? styles.active : ''}`}>
            Basic Info
          </div>
          <div className={`${styles.step} ${step >= 2 ? styles.active : ''}`}>
            Rental Images
          </div>
          <div className={`${styles.step} ${step >= 3 ? styles.active : ''}`}>
            Utility Bills
          </div>
        </div>

        {step === 1 && (
          <form onSubmit={handleBasicInfoSubmit} className={styles.form}>
            <h2>Basic Information</h2>
            
            <div className={styles.formGroup}>
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="price">Price</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="home_size">Home Size (sq ft)</label>
                <input
                  type="number"
                  id="home_size"
                  name="home_size"
                  value={formData.home_size}
                  onChange={(e) => setFormData({...formData, home_size: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                required
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="state">State</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={(e) => setFormData({...formData, state: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="floor">Floor</label>
                <input
                  type="text"
                  id="floor"
                  name="floor"
                  value={formData.floor}
                  onChange={(e) => setFormData({...formData, floor: e.target.value})}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="booking_schedule">Booking Schedule</label>
                <input
                  type="date"
                  id="booking_schedule"
                  name="booking_schedule"
                  value={formData.booking_schedule}
                  onChange={(e) => setFormData({...formData, booking_schedule: e.target.value})}
                  required
                />
              </div>
            </div>

            <button type="submit" className={styles.button}>
              Next: Upload Images
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleRentalImageSubmit} className={styles.form}>
            <h2>Upload Rental Images</h2>
            
            {console.log(listing_id)}
            <div className={styles.formGroup}>
              <label htmlFor="rental_image">Rental Images</label>
              <input
                type="file"
                id="rental_image"
                accept="image/*"
                onChange={(e) => setRentalImage(e.target.files[0])}
                required
              />
            </div>

            <div className={styles.preview}>
              {rentalImage && (
                <img
                  src={URL.createObjectURL(rentalImage)}
                  alt="Rental preview"
                  className={styles.previewImage}
                />
              )}
            </div>

            <div className={styles.buttons}>
              <button
                type="button"
                onClick={() => setStep(1)}
                className={`${styles.button} ${styles.buttonSecondary}`}
              >
                Back
              </button>
              <button type="submit" className={styles.button}>
                Save
              </button>
              <button 
                type="button" 
                onClick={() => setStep(3)} 
                className={styles.button}
              >
                Next: Utility Bills
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleUtilityImageSubmit} className={styles.form}>
            <h2>Upload Utility Bills</h2>
            
            <div className={styles.formGroup}>
              <label htmlFor="utility_image">Utility Bill Images</label>
              <input
                type="file"
                id="utility_image"
                accept="image/*"
                onChange={(e) => setUtilityImage(e.target.files[0])}
                required
              />
            </div>

            <div className={styles.preview}>
              {utilityImage && (
                <img
                  src={URL.createObjectURL(utilityImage)}
                  alt="Utility bill preview"
                  className={styles.previewImage}
                />
              )}
            </div>

            <div className={styles.buttons}>
              <button
                type="button"
                onClick={() => setStep(2)}
                className={`${styles.button} ${styles.buttonSecondary}`}
              >
                Back
              </button>
              <button type="submit" className={styles.button}>
                Save
              </button>
              <button 
                type="button"
                onClick={handleCompleteSubmit}
                className={styles.button}>
                Complete
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

