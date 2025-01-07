import styles from './about.module.css'

export default function About() {
  return (
    <main className={styles.about}>
      <div className="container">
        <h1>About E-Booking</h1>
        <p>E-Booking is your trusted partner in finding the perfect accommodation for your travels. We connect travelers with property owners worldwide, ensuring a seamless booking experience.</p>
        
        <div className={styles.mission}>
          <h2>Our Mission</h2>
          <p>To provide travelers with the best accommodation options while helping property owners maximize their rental potential.</p>
        </div>

        <div className={styles.values}>
          <h2>Our Values</h2>
          <ul>
            <li>Trust and Transparency</li>
            <li>Customer Satisfaction</li>
            <li>Quality Assurance</li>
            <li>Innovation</li>
          </ul>
        </div>
      </div>
    </main>
  )
}

