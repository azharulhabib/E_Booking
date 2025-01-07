import { getUserById, getUserId, getUserRole, getUsers } from '@/libs/api'
import { redirect } from 'next/navigation'
import UserProfile from './user-profile'
import AdminDashboard from './admin-dashboard'
import styles from './profile.module.css'

export default async function ProfilePage({ params }) {
  const currentUserRole = await getUserRole()
  console.log(currentUserRole)
  const currentUserId = await getUserId()
  
  // If not logged in, redirect to login
  if (!currentUserId) {
    redirect('/login')
  }

  // For superuser, show admin dashboard
  if (currentUserRole === 'Superuser') {
    const users = await getUsers()
    return <AdminDashboard users={users} />
  }

  // For regular users, get their profile data
  const userData = await getUserById()
  const params_obj = await params
  const isOwnProfile = currentUserId === params_obj.id

  // If trying to access someone else's profile without permission
  if (!isOwnProfile && currentUserRole !== 'Superuser') {
    redirect('/')
  }

  return <UserProfile user={userData} isOwnProfile={isOwnProfile} isSuperuser={currentUserRole === 'Superuser'} />
}

