import Link from 'next/link'
import styles from './Navbar.module.css'

export default function Navbar() {
  return (
    <nav className={styles.nav}>
      <div className={`container ${styles.navContainer}`}>
        <Link href="/" className={styles.logo}>
          E-Booking
        </Link>
        
        <div className={styles.links}>
          <Link href="/">Home</Link>
          <Link href="/eazystay/about">About</Link>
          <Link href="/eazystay/contact">Contact</Link>
        </div>
        
        <div className={styles.auth}>
          <Link href="/login" className="button button-outline">
            Log In
          </Link>
          <Link href="/signup" className="button button-primary">
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  )
}

