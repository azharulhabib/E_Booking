import Link from 'next/link'
import styles from './profile.module.css'

export default function AdminDashboard({ users }) {

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
                  href={`/eazystay/protected/profile/${user.id}`}
                  className={styles.button}
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

