import Link from 'next/link'
import styles from './profile.module.css'

export default function AdminDashboard({ users }) {
  async function deleteUserAction(userId) {
    'use server'
    
    try {
      await deleteUser(userId)
      router.refresh()
    } catch (error) {
      return { error: error.message }
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.adminCard}>
        <h1>User Management</h1>
        <p className={styles.subtitle}>Manage all users in the system</p>
        
        <div className={styles.usersList}>
          {users.map((user) => (
            <div key={user.id} className={styles.userItem}>
              <div className={styles.userInfo}>
                <h3>{user.name}</h3>
                <p>{user.email}</p>
                <p>Role: {user.role}</p>
              </div>
              
              <div className={styles.userActions}>
                <Link 
                  href={`/profile/${user.id}`}
                  className={styles.button}
                >
                  Edit
                </Link>
                <form action={deleteUserAction.bind(null, user.id)}>
                  <button type="submit" className={`${styles.button} ${styles.buttonDelete}`}>
                    Delete
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

