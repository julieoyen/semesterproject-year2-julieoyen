import { API_AUCTION_PROFILES } from '../utilities/constants';
import { headers } from '../utilities/headers';
//Retrieve userID from local storage
export function getMyName() {
  return localStorage.getItem('userID');
}

//Retrieve Token from local storage
export function getMyToken() {
  return localStorage.getItem('token');
}

//Retrieve name of author from URL
export function getNameFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('author');
}

//Retrieve post from ID from URL
export function getIDFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id'); // Change to 'id' if your URL is using 'id'
}

export function isLoggedIn() {
  return !!getMyToken();
}

export async function getMyCredit() {
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

    return credits;
  } catch (error) {
    console.error('Error in getMyCredit:', error.message);
    return 0;
  }
}
