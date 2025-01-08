'use client'

import { useState } from 'react'
import Link from 'next/link'
import { deleteUserAction } from '@/actions/profile'
import CreateAdminForm from '@/components/Create-Admin-Form/create-admin-form'
import styles from './profile.module.css'

export default function AdminDashboard({ users }) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const handleDelete = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      setDeleting(userId);
      const result = await deleteUserAction(userId);
      if (result.success) {
        // Refresh the page to show updated user list
        window.location.reload();
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className={styles.container}>
      {showCreateForm ? (
        <CreateAdminForm 
          onSuccess={() => {
            setShowCreateForm(false);
            window.location.reload();
          }}
          onCancel={() => setShowCreateForm(false)}
        />
      ) : (
        <div className={styles.adminCard}>
          <h1 className={styles.header1}>User Management</h1>
          <p className={styles.subtitle}>Manage all users in the system</p>
          
          <div className={styles.userActions}>
            <button 
              onClick={() => setShowCreateForm(true)}
              className={styles.button}
            >
              Create New Admin
            </button>
          </div>

          <div className={styles.usersList}>
            {users.map((user) => (
              <div key={user.id} className={styles.userItem}>
                <div className={styles.userInfo}>
                  <h3>{user.name}</h3>
                  <p>{user.email}</p>
                  <p>Role: {user.role}</p>
                </div>
                <button
                  onClick={() => handleDelete(user.id)}
                  className={styles.userDeleteButton}
                  disabled={deleting === user.id}
                >
                  {deleting === user.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}



