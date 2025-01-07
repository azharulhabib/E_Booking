import styles from './about.module.css'

export default function About() {
  return (
    <main className={styles.about}>
      <div className="container">
        <h1>About EasyStay</h1>
        <p>EasyStay is your trusted partner in finding the perfect home to rent in Bangladesh. We connect tenants with property owners across the country, ensuring a hassle-free renting experience.</p>
        
        <div className={styles.mission}>
          <h2>Our Mission</h2>
          <p>To provide renters with the best housing options while helping property owners find reliable tenants and maximize their property's rental potential.</p>
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

