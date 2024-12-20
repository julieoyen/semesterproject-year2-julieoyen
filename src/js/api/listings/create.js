import { API_AUCTION_LISTINGS } from '../../utilities/constants';
import { headers } from '../../utilities/headers';
import { getKey } from '../auth/key';

/**
 * Submits a new auction listing to the API.
 * @param {Object} params - The listing parameters.
 * @param {string} params.title - The title of the listing.
 * @param {string} params.description - The description of the listing.
 * @param {string[]} [params.tags=[]] - An array of tags associated with the listing.
 * @param {Array<{url: string, alt: string}>} [params.media=[]] - Array of media objects with URLs and alt text.
 * @param {string} params.endsAt - The end date and time in ISO format.
 * @throws Will throw an error if validation or submission fails.
 * @returns {Promise<Object|void>} The response from the API or nothing for a 204 response.
 */
export async function submitListing({
  title,
  description,
  tags = [],
  media = [],
  endsAt,
}) {
  if (!title || title.trim() === '') {
    throw new Error('Title is required.');
  }
  if (!endsAt || isNaN(Date.parse(endsAt))) {
    throw new Error('endsAt must be a valid ISO date.');
  }

  const apiUrl = API_AUCTION_LISTINGS;
  const token = await getKey();

  const requestHeaders = headers();
  requestHeaders.append('Authorization', `Bearer ${token}`);
  requestHeaders.append('Content-Type', 'application/json');

  const payload = {
    title: title.trim(),
    description: description?.trim() || '',
    tags: Array.isArray(tags) ? tags : [tags],
    media: media.map(({ url, alt }) => ({
      url: url.trim(),
      alt: alt.trim() || 'Image description',
    })),
    endsAt: new Date(endsAt).toISOString(),
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: requestHeaders,
      body: JSON.stringify(payload),
    });

    if (response.status === 204) {
      return;
    }

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.message || 'Failed to create listing.');
    }

    return await response.json();
  } catch (error) {
    throw new Error('Unable to create the listing. Please try again later.');
  }
}
