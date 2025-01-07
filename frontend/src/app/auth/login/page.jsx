'use client';

import Link from 'next/link';
import { loginAction } from '@/actions/login';
import styles from './login.module.css';
import { useActionState } from 'react';

export default function LoginPage() {
  const [state, formAction] = useActionState(loginAction, { error: null });

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>Welcome Back</h1>
        <p className={styles.subtitle}>Login to your account</p>
        
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
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              placeholder="Enter your password"
              required 
            />
          </div>
          
          <button type="submit" className={styles.button}>
            Log In →
          </button>
        </form>
        
        <p className={styles.signup}>
          Don't have an account?{' '}
          <Link href="/auth/signup">Sign up</Link>
        </p>
      </div>
      
      <footer className={styles.footer}>
        <p>© 2023 E-Booking. All rights reserved.</p>
      </footer>
    </div>
  )
}

