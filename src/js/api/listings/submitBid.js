import { API_AUCTION_LISTINGS } from '../../utilities/constants';
import { loggedInHeaders } from '../../utilities/headers';

/**
 * Submits a bid for a specific auction.
 * @param {string} id - The auction ID.
 * @param {number} amount - The bid amount.
 * @returns {Promise<Object>} - The API response data.
 * @throws {Error} - Throws an error if the request fails.
 */
export async function submitBid(id, amount) {
  const apiUrl = `${API_AUCTION_LISTINGS}/${id}/bids`;
  const myHeaders = await loggedInHeaders();
  const body = JSON.stringify({ amount });

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: myHeaders,
      body: body,
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('API Error:', data);
      throw new Error(data.error || 'Failed to place bid.');
    }
    return data;
  } catch (error) {
    console.error('Error during bid submission:', error.message);
    throw error;
  }
}
