import Link from 'next/link';
import styles from './Navbar.module.css';
import { getUserRole, getUserId } from '@/libs/api';
import { LogoutButton } from '@/components/Button/Button';


export default async function Navbar() {
  const userRole = await getUserRole();
  const userId = await getUserId();

  return (
    <nav className={styles.nav}>
      <div className={`container ${styles.navContainer}`}>
        <Link href="/" className={styles.logo}>
          EazyStay
        </Link>
        
        <div className={styles.links}>
          <Link href="/">Home</Link>
          <Link href="/eazystay/about">About</Link>
          <Link href="/eazystay/contact">Contact</Link>
        </div>
        
        <div className={styles.auth}>
          {!userRole &&
          <>
            <Link href="/auth/login" className="button button-outline">
            Log In
            </Link>
            <Link href="/auth/signup" className="button button-primary">
              Sign Up
            </Link>
          </>
          }
          {(userRole === "Employee") &&
            <Link href="/eazystay/protected/dashboard" className="button button-outline">
              Dashboard
            </Link>
          }
          {userRole &&
            <>
              <Link href={"/eazystay/protected/profile/" + userId} className="button button-outline">
                Profile
              </Link>
              <LogoutButton />
            </>
          }

        </div>
      </div>
    </nav>
  )
}

