'use client'

import { useState } from 'react'
import { createAdminAction } from '@/actions/profile'
import styles from './create-admin.module.css'

export default function CreateAdminForm({ onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone_number: '',
    password: '',
    confirm_password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const result = await createAdminAction({
        email: formData.email,
        name: formData.name,
        phone_number: formData.phone_number,
        password: formData.password
      });

      if (result.error) {
        setError(result.error);
        return;
      }

      onSuccess?.();
    } catch (err) {
      setError('Failed to create admin account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2>Create New Admin</h2>
      <p className={styles.subtitle}>Add a new administrator to the system</p>

      {error && <div className={styles.error}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="full_name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter full name"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="phone_number">Phone Number</label>
          <input
            type="tel"
            id="phone_number"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            placeholder="Enter phone number"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a password"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="confirm_password">Confirm Password</label>
          <input
            type="password"
            id="confirm_password"
            name="confirm_password"
            value={formData.confirm_password}
            onChange={handleChange}
            placeholder="Confirm your password"
            required
          />
        </div>

        <div className={styles.formActions}>
          <button 
            type="button" 
            onClick={onCancel}
            className={styles.cancelButton}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Admin'}
          </button>
        </div>
      </form>
    </div>
  );
}

