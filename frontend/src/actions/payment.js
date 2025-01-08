'use server';

import { getPayments, createPayment } from "@/libs/api";

export async function createPaymentAction(paymentData) {
  try {
    const response = await createPayment(paymentData)
    
    return { success: true, data: response };
  } catch (error) {
    console.error('Error creating payment:', error);
    return { error: 'Failed to process payment' };
  }
}

export async function getPaymentsAction() {
  try {
    const response = await getPayments()
    
    if (!response) {
      throw new Error('Failed to fetch payments');
    }
    
    return { success: true, data: response };
  } catch (error) {
    console.error('Error fetching payments:', error);
    return { error: 'Failed to fetch payments' };
  }
}

