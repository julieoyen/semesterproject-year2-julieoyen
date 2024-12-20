import { API_AUCTION_LISTINGS } from '../../utilities/constants';
import { getMyToken } from '../../utilities/getInfo';
import { headers } from '../../utilities/headers';

export async function deleteListing(id) {
  const API_URL = `${API_AUCTION_LISTINGS}/${id}`;
  const token = getMyToken();
  try {
    const baseHeaders = headers();
    baseHeaders.append('Authorization', `Bearer ${token}`);
    baseHeaders.append('Content-Type', 'application/json');

    const response = await fetch(API_URL, {
      method: 'DELETE',
      headers: baseHeaders,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error response from API:', errorData);
      throw new Error(errorData.message || 'Failed to delete listing');
    }
  } catch (error) {
    console.error('Error deleting listing:', error.message);
    alert('Failed to delete the listing. Please try again later.');
    throw error;
  }
}
