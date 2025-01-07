'use server';

import { login, getAccessToken } from '@/libs/api';
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