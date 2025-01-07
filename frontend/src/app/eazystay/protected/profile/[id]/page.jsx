import { getUserById, userRole, userId, getUsers } from '@/libs/api'
import { redirect } from 'next/navigation'
import UserProfile from './user-profile'
import AdminDashboard from './admin-dashboard'
import styles from './profile.module.css'

export default async function ProfilePage({ params }) {
  const currentUserRole = await userRole()
  const currentUserId = await userId()
  
  // If not logged in, redirect to login
  if (!currentUserId) {
    redirect('/login')
  }

  // For superuser, show admin dashboard
  if (currentUserRole === 'superuser') {
    const users = await getUsers()
    return <AdminDashboard users={users} />
  }

  // For regular users, get their profile data
  const userData = await getUserById()
  const isOwnProfile = currentUserId === params.id

  // If trying to access someone else's profile without permission
  if (!isOwnProfile && currentUserRole !== 'superuser') {
    redirect('/')
  }

  return <UserProfile user={userData} isOwnProfile={isOwnProfile} />
}

