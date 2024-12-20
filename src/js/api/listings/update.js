import { API_AUCTION_LISTINGS } from '../../utilities/constants';
import { headers } from '../../utilities/headers';
import { getMyToken, getIDFromURL } from '../../utilities/getInfo';
import { showToast } from '../../utilities/toast';

const id = getIDFromURL();
const apiUrl = `${API_AUCTION_LISTINGS}/${id}`;
const token = getMyToken();

/**
 * Updates a listing via the API.
 * @param {Event} event - The form submission event.
 */
export async function updateListing(event) {
  event.preventDefault();

  const errorContainer = document.getElementById('error-container');
  errorContainer.innerHTML = ''; // Clear previous errors
  errorContainer.classList.add('hidden'); // Hide error container initially

  try {
    validateForm();

    const payload = createPayload();
    const requestHeaders = headers();
    requestHeaders.append('Authorization', `Bearer ${token}`);
    requestHeaders.append('Content-Type', 'application/json');

    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: requestHeaders,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.message || 'Failed to update listing.');
    }

    const result = await response.json();
    showToast('Listing updated successfully!');
    setTimeout(() => {
      window.location.href = history.go(-1);
    }, 3000);
    return result;
  } catch (error) {
    errorContainer.innerHTML = `<p>${error.message}</p>`;
    errorContainer.classList.remove('hidden');
    console.error('Failed to update listing:', error);
  }
}

/**
 * Validates form inputs for the update listing page.
 * @throws {Error} If any validation fails.
 */
function validateForm() {
  const title = document.querySelector('#title').value.trim();
  const description = document.querySelector('#description').value.trim();

  if (!title || title.length < 0) {
    throw new Error('Title cannot be empty');
  }

  if (!description) {
    throw new Error('Description cannot be empty.');
  }
}

/**
 * Gathers form data into a payload object.
 * @returns {Object} The payload for the update request.
 */
export function createPayload() {
  const title = document.querySelector('#title').value.trim();
  const description = document.querySelector('#description').value.trim();
  const tags = document
    .querySelector('#tags')
    .value.split(',')
    .map((tag) => tag.trim())
    .filter((tag) => tag !== '');
  const media = gatherImageInputs();

  return {
    title: title || undefined,
    description: description || undefined,
    tags: tags.length > 0 ? tags : undefined,
    media: media.length > 0 ? media : undefined,
  };
}

/**
 * Collects image inputs from the form.
 * @returns {Array<Object>} An array of image objects with URL and alt text.
 */
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
