import styles from './contact.module.css'

export default function Contact() {
  return (
    <main className={styles.contact}>
      <div className="container">
        <div>        
        <h1>Contact Us</h1>
          <p>Have questions? We'd love to hear from you. Contact our customer support.</p>
        </div>

      <div>
        <h2>Our Office</h2>
        <p>E-Booking Headquarters</p>
        <p>123/A, Gulshan Avenue, Dhaka-1212, Bangladesh</p>
      </div>
      <div>
        <h2>Customer Support</h2>
        <p>📞 Hotline: +880-123-456-7890 (Available 9 AM – 9 PM)</p>
        <p>📧 Email: support@easystay.com.bd</p>
      </div>

      <div>
        <h2>Stay connected with us on:</h2>
        <p>Facebook: facebook.com/easystaybd</p>
        <p>Instagram: instagram.com/easystaybd</p>
        <p>Twitter: twitter.com/easystaybd</p>
      </div>
      </div>
    </main>
  )
}
