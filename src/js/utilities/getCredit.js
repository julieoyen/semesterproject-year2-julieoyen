import { API_AUCTION_PROFILES } from '../utilities/constants';
import { headers } from '../utilities/headers';
import { getMyToken, getMyName } from './getInfo';
/**
 * Fetches and returns the user's credit balance from the auction profile API.
 * @returns {Promise<number>} The user's credit balance or 0 if an error occurs.
 */
export async function getCredits() {
  const token = getMyToken();
  const name = getMyName();

  if (!token || !name) {
    console.warn('Missing token or username');
    return 0;
  }

  try {
    const apiHeaders = headers();
    apiHeaders.append('Authorization', `Bearer ${token}`);

    const response = await fetch(`${API_AUCTION_PROFILES}/${name}`, {
      method: 'GET',
      headers: apiHeaders,
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error('API Error:', responseData.errors);
      throw new Error(`Error fetching credit: ${response.status}`);
    }

    const credits = responseData?.data?.credits || 0;
    localStorage.setItem('myCredits', credits);
    return credits;
  } catch (error) {
    console.error('Error in getMyCredit:', error.message);
    return 0;
  }
}
