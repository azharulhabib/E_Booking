'use client'

import { updateUser, deleteUser } from '@/libs/api'
import { useRouter } from 'next/navigation'
import styles from './profile.module.css'

export default function UserProfile({ user, isOwnProfile }) {
  const router = useRouter()

  async function updateAction(formData) {
    'use server'
    
    const userData = {
      email: formData.get('email'),
      name: formData.get('name'),
      phone: formData.get('phone'),
    }

    try {
      await updateUser(userData)
      router.refresh()
      return { success: true }
    } catch (error) {
      return { error: error.message }
    }
  }

  async function deleteAction() {
    'use server'
    
    try {
      await deleteUser()
      router.push('/')
    } catch (error) {
      return { error: error.message }
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>Profile Details</h1>
        <p className={styles.subtitle}>Manage your account information</p>
        
        <form action={updateAction} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              defaultValue={user.email}
              placeholder="Enter your email"
              required 
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
              required 
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="phone">Phone Number</label>
            <input 
              type="tel" 
              id="phone" 
              name="phone" 
              defaultValue={user.phone}
              placeholder="Enter your phone number"
              required 
            />
          </div>
          
          <div className={styles.actions}>
            <button type="submit" className={styles.button}>
              Update Profile
            </button>
            
            {isOwnProfile && (
              <button
                type="button"
                onClick={() => deleteAction()}
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

