import Link from 'next/link'
import styles from './signup.module.css'

export default function SignupPage() {
  return (
    <div className={styles.container}>
      <h1>Choose Your Sign Up Option</h1>
      
      <div className={styles.optionsContainer}>
        <div className={styles.card}>
          <h2>Sign Up as a Customer</h2>
          <p className={styles.subtitle}>Find and book your perfect stay</p>
          
          <ul className={styles.features}>
            <li>→ Access to a wide range of properties</li>
            <li>→ Easy booking process</li>
            <li>→ 24/7 customer support</li>
          </ul>
          
          <Link href="/auth/signup/customer" className={styles.button}>
            Sign Up as Customer
          </Link>
        </div>
        
        <div className={styles.card}>
          <h2>Sign Up as an Owner</h2>
          <p className={styles.subtitle}>List and manage your properties</p>
          
          <ul className={styles.features}>
            <li>→ List multiple properties</li>
            <li>→ Manage bookings efficiently</li>
            <li>→ Access to owner dashboard</li>
          </ul>
          
          <Link href="/auth/signup/owner" className={styles.button}>
            Sign Up as Owner
          </Link>
        </div>
      </div>
      
      <footer className={styles.footer}>
        <p>© 2023 E-Booking. All rights reserved.</p>
      </footer>
    </div>
  )
}

