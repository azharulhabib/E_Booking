'use client';
import Link from 'next/link';
import styles from '../form.module.css';
import { useActionState } from 'react';
import { signUpCustomerAction } from '@/actions/signup';


export default function CustomerSignup() {
  const [state, formAction] = useActionState(signUpCustomerAction, { error: null });

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>Sign Up as a Customer</h1>
        <p className={styles.subtitle}>Create your account to start booking</p>
        
        {state.error && <p className={styles.error}>{state.error}</p>}
        <form action={formAction} className={styles.form}>
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

