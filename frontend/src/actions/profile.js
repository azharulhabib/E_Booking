'use server';
import { updateUser, deleteUser } from '@/libs/api';

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