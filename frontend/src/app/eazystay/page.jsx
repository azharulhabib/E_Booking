import Link from 'next/link'
import styles from './page.module.css'

export default function Home() {
  return (
    <main>
      <section className={styles.hero}>
        <div className="container">
          <h1>Find Your Perfect Home Away From Home</h1>
          <p>Join thousands of happy travelers and property owners on E-Booking. Sign up today and start your journey!</p>
        </div>
      </section>

      <section className={styles.features}>
        <div className="container">
          <h2>Why Choose E-Booking?</h2>
          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <div className={styles.icon}>🏠</div>
              <h3>Diverse Properties</h3>
              <p>From cozy apartments to luxurious villas, find the perfect place for your next stay.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.icon}>📅</div>
              <h3>Flexible Bookings</h3>
              <p>Enjoy peace of mind with our flexible cancellation and modification policies.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.icon}>👥</div>
              <h3>24/7 Support</h3>
              <p>Our dedicated team is always ready to assist you with any queries or issues.</p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <div className="container">
          <h2>Ready to Start Your Journey?</h2>
          <p>Sign up now and get access to exclusive deals and properties!</p>
          <div className={styles.benefits}>
            <span>✓ No hidden fees</span>
            <span>✓ Verified properties</span>
            <span>✓ Best price guarantee</span>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className="container">
          <p>© 2023 E-Booking. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}


