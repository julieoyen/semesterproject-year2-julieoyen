//api/listings/submitbid.js:
import { API_AUCTION_LISTINGS } from '../../utilities/constants';
import { getIDFromURL } from '../../utilities/getInfo';
import { loggedInHeaders } from '../../utilities/headers';
import { getKey } from '../../api/auth/key';
const apiUrl = API_AUCTION_LISTINGS;

export async function submitBid(amount) {
  const id = getIDFromURL();
  const myHeaders = await loggedInHeaders();
  const body = JSON.stringify({ amount });

  try {
    const response = await fetch(`${apiUrl}/${id}/bids`, {
      method: 'POST',
      headers: myHeaders,
      body: body,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error('Error');
    }
    return data;
  } catch (error) {
    console.error('Error during bid submission:', error.message);
    throw error;
  }
}
