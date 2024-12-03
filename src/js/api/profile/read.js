import { API_AUCTION_PROFILES } from '../../utilities/constants';
import { headers } from '../../utilities/headers';
import { getNameFromURL, getMyToken } from '../../utilities/getInfo';

const token = await getMyToken();

export async function readProfile() {
  const username = getNameFromURL();
  const requestHeaders = headers();
  requestHeaders.append('Authorization', `Bearer ${token}`);
  const fetchOptions = createFetchOptions(requestHeaders);
  const fetchUrl = `${API_AUCTION_PROFILES}/${seller}`;

  const response = await makeGetRequest(fetchUrl, fetchOptions);
  if (!response) {
    return null;
  }
  return response;
}

const createFetchOptions = (requestHeaders) => {
  return {
    method: 'GET',
    headers: requestHeaders,
    redirect: 'follow',
  };
};

const makeGetRequest = async (url, fetchOptions) => {
  try {
    const response = await fetch(url, fetchOptions);
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
    const result = await response.json();
    return result.data;
  } catch (error) {
    return null;
  }
};
