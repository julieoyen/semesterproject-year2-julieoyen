import { API_AUCTION_PROFILES } from '../../utilities/constants';
import { loggedInHeaders } from '../../utilities/headers';

const BASE_URL = API_AUCTION_PROFILES;

let myHeaders;

/**
 * Get or initialize headers for requests
 */
async function getHeaders() {
  if (!myHeaders) {
    myHeaders = await loggedInHeaders();
  }
  return myHeaders;
}

/**
 * Fetch profile data by profile name
 * @param {string} profileName - Name of the profile to fetch
 * @param {Object} options - Query options like _listings, _wins
 * @returns {Object|null} - Profile data or null on failure
 */
export async function fetchProfileData(profileName, options = {}) {
  const params = new URLSearchParams({ ...options }).toString();
  const endpoint = `${BASE_URL}/${profileName}?${params}`;

  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: await getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch profile: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching profile data:', error.message);
    return null;
  }
}
