'use client'

import { useState, useEffect } from 'react'
import { getPaymentsAction } from '@/actions/payment'
import styles from './payments.module.css'

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchPayments() {
      try {
        const result = await getPaymentsAction();
        if (result.error) {
          setError(result.error);
          return;
        }
        setPayments(result.data);
      } catch (err) {
        setError('Failed to fetch payments');
      } finally {
        setLoading(false);
      }
    }

    fetchPayments();
  }, []);

  if (loading) {
    return <div className={styles.container}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.container}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <h1>Payment History</h1>

      <div className={styles.paymentsList}>
        {payments.length > 0 ? (
          payments.map(payment => (
            <div key={payment.id} className={styles.paymentCard}>
              <div className={styles.paymentInfo}>
                <div className={styles.amount}>
                  ${parseFloat(payment.amount).toFixed(2)}
                </div>
                <div className={styles.date}>
                  {new Date(payment.payment_date).toLocaleDateString()}
                </div>
              </div>
              <div className={styles.status}>
                <span className={`${styles.badge} ${payment.payment_status ? styles.success : styles.pending}`}>
                  {payment.payment_status ? 'Paid' : 'Pending'}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.empty}>No payments found</div>
        )}
      </div>
    </div>
  );
}

