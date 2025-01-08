'use server';

import { login, getAccessToken, getUserRole } from '@/libs/api';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function loginAction(prevState, formData) {

  const credentials = {
    email: formData.get('email'),
    password: formData.get('password'),
  };

  try {
    const response = await login(credentials)
    if (response.status) {
      return { error: 'Invalid credentials' };
    }
  } catch (error) {
    return { error: error.message };
  };

  revalidatePath('/eazystay');
  redirect('/eazystay');
};

export async function retrieveAccessToken() {
  const accessToken = await getAccessToken();
  return accessToken;
};

export async function retrieveUserRole() {
  const userRole = await getUserRole();
  return userRole;
};

export async function retrieveUserId() {
  const cookieStore = await cookies();
  return cookieStore.get('userId')?.value;
}