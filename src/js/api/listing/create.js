import { API_AUCTION_LISTINGS } from '../../utilities/constants';
import { headers } from '../../utilities/headers';
import { getKey } from '../auth/key';

export async function createListing({
  title,
  description,
  tags = [],
  media = [],
  endsAt = new Intl.DateTimeFormat(en - uk),
}) {
  if (!title || title.trim() === '') {
    throw new Error('Title is required.');
  }
  if (!endsAt || isNaN(Date.parse(endsAt))) {
    throw new Error('endsAt must be a valid ISO date.');
  }

  const apiUrl = API_AUCTION_LISTINGS;
  const accessToken = await getKey();

  const requestHeaders = headers();
  requestHeaders.append('Authorization', `Bearer ${accessToken}`);
  requestHeaders.append('Content-Type', 'application/json');

  const payload = {
    title: title.trim(),
    endsAt: new Date(endsAt).toISOString(),
    description: description?.trim() || '',
    tags: tags.map((tag) => tag.trim()),
    media: media.map(({ url, alt }) => ({
      url: url.trim(),
      alt: alt.trim() || 'Image description',
    })),
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: requestHeaders,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      console.error('API Error:', errorResponse);
      throw new Error(errorResponse.message || 'Failed to create listing.');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating listing:', error);
    throw new Error('Unable to create the listing. Please try again later.');
  }
}
