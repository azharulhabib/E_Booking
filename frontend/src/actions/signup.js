'use server';
import { createCustomer, createOwner } from "@/libs/api";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function signUpCustomerAction(prevState, formData) {
  
  if (formData.get('password') !== formData.get('confirmPassword')) {
    return { error: 'Passwords do not match' }
  };

  const userData = {
    email: formData.get('email'),
    name: formData.get('name'),
    phone_number: formData.get('phone'),
    password: formData.get('password'),
  };

  console.log(userData);

  try {
    const response = await createCustomer(userData)
    if (response.status) {
      return { error: 'Registration failed or email already exists' }
    };
  } catch (error) {
    return { error: 'Registration failed or email already exists' }
  };

  revalidatePath('/auth/login');
  redirect('/auth/login');
};

export async function signUpOwnerAction(prevState, formData) {
  'use server'
  
  if (formData.get('password') !== formData.get('confirmPassword')) {
    return { error: 'Passwords do not match' }
  };

  const userData = {
    email: formData.get('email'),
    name: formData.get('name'),
    phone_number: formData.get('phone'),
    password: formData.get('password'),
  };

  try {
    const response = await createOwner(userData)
    if (response.status) {
      return { error: 'Registration failed or email already exists' }
    }
  } catch (error) {
    return { error: 'Registration failed or email already exists' }
  };

  revalidatePath('/auth/login');
  redirect('/auth/login');
};