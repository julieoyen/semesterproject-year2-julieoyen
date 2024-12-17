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
 * Fetch profile data with optional query parameters
 */
async function fetchProfileData(profileName, options = {}) {
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

export async function fetchAllProfileData(profileName) {
  try {
    const [profileResponse, bidsResponse] = await Promise.all([
      fetchProfileData(profileName, { _listings: true, _wins: true }),
      fetch(`${BASE_URL}/${profileName}/bids?_listings=true`, {
        headers: await getHeaders(),
      }),
    ]);

    const profile = profileResponse?.data || {};
    const bidsData = await bidsResponse.json();

    return {
      profile,
      bids: bidsData?.data || [],
      listings: profile.listings || [],
      wins: profile.wins || [],
    };
  } catch (error) {
    console.error('Error fetching all profile data:', error.message);
    return null;
  }
}
