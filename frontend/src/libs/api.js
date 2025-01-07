import { fetchClient, fetchClientForm } from "./fetchClient";
import { cookies } from 'next/headers';


const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const login = async (credentials) => {
  try {
    const response = await fetchClient(`${API_BASE_URL}/login/`, {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    if (response.access && response.refresh && response.user_role) {
      const cookieStore = await cookies();
      cookieStore.set('accessToken', response.access, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
      cookieStore.set('refreshToken', response.refresh, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
      cookieStore.set('userRole', response.user_role, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
      cookieStore.set('userId', response.user_id, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    };

    return response;
  } catch (error) {
    console.error("Login failed:", error);
    throw new Error("Invalid credentials.");
  };
};

export const logout = async () => {
  const cookieStore = await cookies();
  cookieStore.delete('accessToken');
  cookieStore.delete('refreshToken');
  cookieStore.delete('userRole');
};

export async function getUserId() {
  const cookieStore = await cookies();
  return cookieStore.get('userId')?.value;
};

export async function getUserRole() {
  const cookieStore = await cookies();
  return cookieStore.get('userRole')?.value;
};

export async function getAccessToken() {
  const cookieStore = await cookies();
  return cookieStore.get('accessToken')?.value;
};

export const refreshToken = async () => {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refreshToken')?.value;

  if (!refreshToken) {
    await logout();
    throw new Error("Refresh token not found.");
  };

  try {
    const response = await fetchClient(`${API_BASE_URL}/token/refresh/`, {
      method: "POST",
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (response.access && response.refresh) {
      const cookieStore = await cookies();
      cookieStore.set('accessToken', response.access, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
      cookieStore.set('refreshToken', response.refresh, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    };

    return response;
  } catch (error) {
    console.error("Refresh token failed:", error);
    await logout();
    throw new Error("Refresh token failed.");
  };
};

export const getUserById = async () => {
  const id = await getUserId();
  const response = await fetchClient(`${API_BASE_URL}/users/${id}/`, {
    method: "GET",
  });

  console.log("response", response);
  return response;
};

export const getUsers = async () => {
  const response = await fetchClient(`${API_BASE_URL}/users/`, {
    method: "GET",
  });

  console.log("response", response);
  return response;
};

export const createCustomer = async (user) => {
  const response = await fetchClient(`${API_BASE_URL}/customers/`, {
    method: "POST",
    body: JSON.stringify(user),
  });

  console.log("response", response);
  return response;
};

export const createOwner = async (user) => {
  const response = await fetchClient(`${API_BASE_URL}/owners/`, {
    method: "POST",
    body: JSON.stringify(user),
  });

  console.log("response", response);
  return response;
};

export const updateUser = async (user) => {
  const id = await getUserId();
  const response = await fetchClient(`${API_BASE_URL}/users/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(user),
  });

  console.log("response", response);
  return response;
};

export const deleteUser = async (id=null) => {
  if (!id) {
    var id = await getUserId();
  }

  const response = await fetchClient(`${API_BASE_URL}/users/${id}/`, {
    method: "DELETE",
  });

  console.log("deleteUser", response);
  return response;
}

export const getRentalListings = async () => {
  const response = await fetchClient(`${API_BASE_URL}/rentallistings/`, {
    method: "GET",
  });

  console.log("response", response);
  return response;
};


export const getRentalListingById = async (id) => {
  const response = await fetchClient(`${API_BASE_URL}/rentallistings/${id}/`, {
    method: "GET",
  });

  console.log("response", response);
  return response;
};

export const createRentalListing = async (listing) => {
  const response = await fetchClient(`${API_BASE_URL}/rentallistings/`, {
    method: "POST",
    body: JSON.stringify(listing),
  });

  console.log("response", response);
  return response;
};

export const updateRentalListing = async (listing) => {
  const id = listing.id;
  const response = await fetchClient(`${API_BASE_URL}/rentallistings/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(listing),
  });

  console.log("response", response);
  return response;
};

export const deleteRentalListing = async (id) => {
  const response = await fetchClient(`${API_BASE_URL}/rentallistings/${id}/`, {
    method: "DELETE",
  });

  console.log("response", response);
  return response;
};