import styles from './dashboard.module.css'

export default function StatsCard({ title, value, change, icon }) {
    return (
      <div className={styles.statsCard}>
        <div className={styles.statsContent}>
          <div>
            <h3>{title}</h3>
            <p className={styles.statsValue}>{value}</p>
            <p className={styles.statsChange}>{change}</p>
          </div>
          <div className={styles.statsIcon}>{icon}</div>
        </div>
      </div>
    )
  }
  
  