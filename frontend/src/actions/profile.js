'use server';
import { createAdmin, updateUser, deleteUser } from '@/libs/api';

export async function updateAction(formData) {
  try {
    const response = await updateUser(formData);

    console.log('updateAction', response);

    if (response.status) {
      console.log('error staus');
      return { error: 'Update failed' };
    }

    return { success: true, error: null }

  } catch (error) {
    console.log('error main');
  }
}

export async function deleteAction(id=null) {
  try {
    const response = await deleteUser(id);

    if (response) {
      console.error("Error deleting profile:", response.error);
      return { error: "Failed to delete profile. Please try again later." };
    }
    return response;
  } catch (error) {
    console.error("Error deleting profile:", error);
    return { error: "Failed to delete profile. Please try again later." };
  }
}

export async function deleteUserAction(id) {
  try {
    const response = await deleteUser(id);
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting user:', error);
    return { error: 'Failed to delete user' };
  }
}

export async function createAdminAction(userData) {
  try {
    const response = await createAdmin(userData);
    
    console.log('createAdminAction', response);
    return { success: true };
  } catch (error) {
    console.error('Error creating admin:', error);
    return { error: 'Failed to create admin' };
  }
}

