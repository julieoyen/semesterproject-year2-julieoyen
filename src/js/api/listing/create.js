import { API_AUCTION_LISTINGS } from '../../utilities/constants';
import { headers } from '../../utilities/headers';
import { getKey } from '../auth/key';

export async function createListing({
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
      return; // Successfully created, no further action needed
    }

    if (!response.ok) {
      const errorResponse = await response.json();

      console.error('API Error Details:', errorResponse);

      throw new Error(errorResponse.message || 'Failed to create listing.');
    }

    return await response.json(); // This line may not be reached if the response is 204
  } catch (error) {
    console.error('Error creating listing:', error);

    throw new Error('Unable to create the listing. Please try again later.');
  }
}
