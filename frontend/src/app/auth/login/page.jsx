import { login } from '@/libs/api'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import styles from './login.module.css'

async function loginAction(formData) {
  'use server'
  
  const credentials = {
    email: formData.get('email'),
    password: formData.get('password'),
  }

  try {
    const response = await login(credentials)
    if (response.access) {
      redirect('/')
    }
    return { error: 'Invalid credentials' }
  } catch (error) {
    return { error: error.message }
  }
}

export default function LoginPage() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>Welcome Back</h1>
        <p className={styles.subtitle}>Login to your account</p>
        
        <form action={loginAction} className={styles.form}>
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

