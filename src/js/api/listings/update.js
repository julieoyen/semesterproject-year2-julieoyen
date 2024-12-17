import { API_AUCTION_LISTINGS } from '../../utilities/constants';
import { headers } from '../../utilities/headers';
import { getMyToken, getIDFromURL } from '../../utilities/getInfo';
import { showToast } from '../../utilities/toast';

const id = getIDFromURL();

const apiUrl = `${API_AUCTION_LISTINGS}/${id}`;
const token = getMyToken();

export async function updateListing(event) {
  event.preventDefault();

  const payload = createPayload();
  const requestHeaders = headers();
  requestHeaders.append('Authorization', `Bearer ${token}`);
  requestHeaders.append('Content-Type', 'application/json');

  try {
    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: requestHeaders,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', response.status, errorText);
      throw new Error(
        `Error updating listing: ${response.statusText} - ${errorText}`
      );
    }

    const result = await response.json();
    showToast('Listing updated successfully!');
    setTimeout(() => {
      window.location.href = history.go(-1);
    }, 3000);
    return result;
  } catch (error) {
    console.error('Failed to update listing:', error);
    alert(`Failed to update listing: ${error.message}`);
  }
}

export function createPayload() {
  const title = document.querySelector('#title').value.trim();
  const description = document.querySelector('#description').value.trim();
  const tags = document
    .querySelector('#tags')
    .value.split(',')
    .map((tag) => tag.trim())
    .filter((tag) => tag !== '');
  const media = gatherImageInputs();

  const payload = {
    title: title || undefined,
    description: description || undefined,
    tags: tags.length > 0 ? tags : undefined,
    media: media.length > 0 ? media : undefined,
  };

  return payload;
}

function gatherImageInputs() {
  const images = [];
  const inputGroups = document.querySelectorAll('.image-input-group');

  inputGroups.forEach((group) => {
    const url = group.querySelector('input[name="imageUrl"]').value.trim();
    const alt = group.querySelector('input[name="imageAlt"]').value.trim();

    if (url) {
      images.push({ url, alt: alt || null });
    }
  });

  return images;
}
