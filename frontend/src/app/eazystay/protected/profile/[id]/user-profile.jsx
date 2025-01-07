'use client';

import styles from './profile.module.css';
import { useRouter } from 'next/navigation';
import { updateAction, deleteAction } from '@/actions/profile';
import { logoutUser } from '@/actions/logout';
import { useState } from 'react';

export default function UserProfile({ user, isOwnProfile, isSuperuser }) {
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();

  const updateProfile = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const name = formData.get('name');
    const phone = formData.get('phone');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return
    };
      
    const userData = {
      ...(name && { name }),
      ...(phone && { phone_number: phone }),
      ...(password && { password })
    }

    try {
      const response = await updateAction(userData);

      if (response.error) {
        console.log('error staus');
        setSuccess(null);
        if (error === 'Passwords do not match') {
          setError('Update failed');
        }
        return
      }

      setSuccess('Profile updated successfully');
      setError(null);
      router.refresh();
    } catch (error) {
      console.error("Error updating stock:", error);
    }
  };

  const handleDelete = async (event) => {
    event.preventDefault();
    const response = await deleteAction();
    if (response) {
      setError('Error deleting profile');
      return
    }
    await logoutUser(); // This will redirect to the login page
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.header1}>Profile Details</h1>
        <p className={styles.subtitle}>Manage your account information</p>

        {success && <p className={styles.success}>{success}</p>}
        {error && <p className={styles.error}>{error}</p>}
        
        <form onSubmit={updateProfile} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              defaultValue={user.email}
              placeholder="Enter your email"
              disabled
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="name">Full Name</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              defaultValue={user.name}
              placeholder="Enter your full name"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="phone">Phone Number</label>
            <input 
              type="tel" 
              id="phone" 
              name="phone" 
              defaultValue={user.phone_number}
              placeholder="Enter your phone number"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              placeholder="Create a password"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input 
              type="password" 
              id="confirmPassword" 
              name="confirmPassword" 
              placeholder="Confirm your password"
            />
          </div>
          
          <div className={styles.actions}>
            <button type="submit" className={styles.button}>
              Update Profile
            </button>
            
            {(isOwnProfile || isSuperuser) && (
              <button
                type="button"
                onClick={handleDelete}
                className={`${styles.button} ${styles.buttonDelete}`}
              >
                Delete Account
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

