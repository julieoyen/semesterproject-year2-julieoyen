import { API_AUCTION_LISTINGS, API_KEY } from '../../utilities/constants';
import { headers } from '../../utilities/headers';
import { getIDFromURL, getMyToken } from '../../utilities/getInfo';

const listingId = getIDFromURL();
const endpoint = `${API_AUCTION_LISTINGS}/${listingId}`;

export async function onUpdateListing(event) {
  event.preventDefault();
  const token = getMyToken();

  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        ...headers(),
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
    const listingData = await response.json();
    populateListingForm(listingData.data);
  } catch (error) {
    console.error('Error fetching listing:', error);
  }
}

function populateListingForm(listing) {
  document.getElementById('title').value = listing.title;
  document.getElementById('description').value = listing.description;
  document.getElementById('bid-ends').value = listing.endsAt;
  document.getElementById('auction-id').value = listing.id;
  document.getElementById('tags').value = listing.tags;
  listing.media.forEach((media) => {
    const imageUrl = media.url;
    const imageAlt = media.alt;
    const newImageInput = document.createElement('input');
    newImageInput.type = 'text';
    newImageInput.name = 'imageUrl';
  });
}
