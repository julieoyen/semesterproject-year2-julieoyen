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

    if (!response.ok) {
      const errorText = `Login failed ${response.statusText} (${response.status})`;
      alert(`Error: ${errorText}. Please try again.`);
      throw new Error(errorText);
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    return { error: error.message };
  }
}
