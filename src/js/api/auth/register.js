import { API_AUTH_REGISTER } from '../../utilities/constants.js';
import { headers } from '../../utilities/headers.js';

export async function register({ name, email, password }) {
  try {
    const response = await fetch(API_AUTH_REGISTER, {
      method: 'POST',
      headers: {
        ...headers(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      const errorMessages =
        responseData.errors?.map((err) => err.message).join(', ') ||
        'Registration failed. Please try again.';
      return { error: errorMessages };
    }

    return responseData;
  } catch (error) {
    console.error('Registration Error:', error);
    return { error: 'An unexpected error occurred. Please try again.' };
  }
}
