import { createCustomer } from '@/libs/api'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import styles from '../form.module.css'

async function signupAction(formData) {
  'use server'
  
  if (formData.get('password') !== formData.get('confirmPassword')) {
    return { error: 'Passwords do not match' }
  }

  const userData = {
    email: formData.get('email'),
    name: formData.get('name'),
    phone: formData.get('phone'),
    password: formData.get('password'),
  }

  try {
    const response = await createCustomer(userData)
    if (response.id) {
      redirect('/login')
    }
    return { error: 'Registration failed' }
  } catch (error) {
    return { error: error.message }
  }
}

export default function CustomerSignup() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>Sign Up as a Customer</h1>
        <p className={styles.subtitle}>Create your account to start booking</p>
        
        <form action={signupAction} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
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
              placeholder="Enter your phone number"
              required 
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              placeholder="Create a password"
              required 
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input 
              type="password" 
              id="confirmPassword" 
              name="confirmPassword" 
              placeholder="Confirm your password"
              required 
            />
          </div>
          
          <button type="submit" className={styles.button}>
            Create Account
          </button>
        </form>
        
        <p className={styles.login}>
          Already have an account?{' '}
          <Link href="/auth/login">Log in</Link>
        </p>
      </div>
      
      <footer className={styles.footer}>
        <p>© 2023 E-Booking. All rights reserved.</p>
      </footer>
    </div>
  )
}

