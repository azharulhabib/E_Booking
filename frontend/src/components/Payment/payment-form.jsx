'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createPaymentAction } from '@/actions/payment'
import styles from './payment-form.module.css'

export default function PaymentForm({ amount, customerId }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cardData, setCardData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: ''
  });

  const handleChange = (e) => {
    setCardData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Only send the required data to the API
      const paymentData = {
        amount: amount,
        customer: customerId,
        payment_date: new Date().toISOString().split('T')[0],
        payment_status: true
      };

      const result = await createPaymentAction(paymentData);

      if (result.error) {
        setError(result.error);
        return;
      }

      router.push('/payments');
    } catch (err) {
      setError('Payment processing failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2>Payment Details</h2>
      <p className={styles.amount}>Amount to Pay: ${amount}</p>

      {error && <div className={styles.error}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Cardholder Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={cardData.name}
            onChange={handleChange}
            placeholder="John Doe"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="cardNumber">Card Number</label>
          <input
            type="text"
            id="cardNumber"
            name="cardNumber"
            value={cardData.cardNumber}
            onChange={handleChange}
            placeholder="1234 5678 9012 3456"
            maxLength="19"
            required
          />
        </div>

        <div className={styles.row}>
          <div className={styles.formGroup}>
            <label htmlFor="expiryDate">Expiry Date</label>
            <input
              type="text"
              id="expiryDate"
              name="expiryDate"
              value={cardData.expiryDate}
              onChange={handleChange}
              placeholder="MM/YY"
              maxLength="5"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="cvv">CVV</label>
            <input
              type="text"
              id="cvv"
              name="cvv"
              value={cardData.cvv}
              onChange={handleChange}
              placeholder="123"
              maxLength="3"
              required
            />
          </div>
        </div>

        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Pay Now'}
        </button>
      </form>
    </div>
  );
}

