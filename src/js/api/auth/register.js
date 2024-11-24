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
      if (responseData.errors?.length > 0) {
        const errorMessages = responseData.errors
          .map((err) => err.message)
          .join('\n');
        alert(`Registration Failed:\n${errorMessages}`);
      }
      const errorText = `Register failed ${response.statusText} (${response.status})`;
      throw new Error(errorText);
    }
    return responseData;
  } catch (error) {
    console.error('Registration Error:', error);
    return { error: 'Invalid email or password. Please try again.' };
  }
}
