import { API_AUTH_LOGIN } from '../../utilities/constants.js';
import { headers } from '../../utilities/headers.js';

export async function login({ email, password }) {
  try {
    const response = await fetch(API_AUTH_LOGIN, {
      method: 'POST',
      headers: {
        ...headers(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      const errorMessages =
        responseData.errors?.map((error) => error.message).join(', ') ||
        'An unknown error occurred.';
      throw new Error(errorMessages);
    }

    return responseData;
  } catch (error) {
    return { error: error.message };
  }
}
