import { API_AUCTION_LISTINGS } from '../../utilities/constants';
import { headers } from '../../utilities/headers';
import { getIDFromURL, getMyToken } from '../../utilities/getInfo';

const id = getIDFromURL();
const apiUrl = `${API_AUCTION_LISTINGS}/${id}`;

/**
 * Fetches the existing listing and populates the edit form.
 */
export async function onUpdateListing() {
  const token = getMyToken();
  const errorContainer = document.getElementById('error-container');
  errorContainer.innerHTML = '';
  errorContainer.classList.add('hidden');

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...headers(),
      },
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(
        errorResponse.message || `Failed to fetch data: ${response.statusText}`
      );
    }

    const listingData = await response.json();
    populateForm(listingData.data);
  } catch (error) {
    errorContainer.innerHTML = `<p>${error.message}</p>`;
    errorContainer.classList.remove('hidden');
    console.error('Error fetching listing:', error);
  }
}

/**
 * Populates the form fields with listing data.
 * @param {Object} listing - The listing data to populate.
 */
function populateForm(listing) {
  document.querySelector('#title').value = listing.title || '';
  document.querySelector('#description').value = listing.description || '';
  document.querySelector('#tags').value = (listing.tags || []).join(', ');

  const imageUrlContainer = document.querySelector('#image-url-container');
  imageUrlContainer.innerHTML = '';

  (listing.media || []).forEach((media) => {
    const inputGroup = createImageInputGroup(media.url, media.alt);
    imageUrlContainer.appendChild(inputGroup);
  });
}

/**
 * Creates an image input group with optional pre-filled values.
 * @param {string} [url=''] - The image URL.
 * @param {string} [alt=''] - The image alt text.
 * @returns {HTMLElement} The input group element.
 */
function createImageInputGroup(url = '', alt = '') {
  const inputGroup = document.createElement('div');
  inputGroup.className = 'image-input-group';
  inputGroup.innerHTML = `
    <div class="image-preview mt-4 flex justify-center">
      <img
        src="${url}"
        alt="${alt}"
        class="w-full max-h-64 max-w-64 flex object-contain mb-2"
      />
    </div>
    <input
      type="text"
      name="imageUrl"
      class="mt-1 block w-full rounded-md border-2 border-gray-300 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2 text-sm sm:text-base"
      placeholder="Enter image URL"
      value="${url}"
      required
    />
    <input
      type="text"
      name="imageAlt"
      class="mt-1 block w-full rounded-md border-2 border-gray-300 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2 text-sm sm:text-base"
      placeholder="Enter image alt text"
      value="${alt}"
      required
    />
    <button
      type="button"
      class="delete-image-btn mt-2 py-1 px-3 shadow-md border-2 rounded-lg text-button border-button bg-transparent hover:bg-slate-100"
    >
      Delete
    </button>
  `;
  return inputGroup;
}

document.getElementById('add-image-url').addEventListener('click', () => {
  const imageUrlContainer = document.querySelector('#image-url-container');
  if (imageUrlContainer.children.length < 8) {
    const newInputGroup = createImageInputGroup();
    imageUrlContainer.appendChild(newInputGroup);
  } else {
    alert('You can add a maximum of 8 images.');
  }
});

document
  .querySelector('#image-url-container')
  .addEventListener('click', (event) => {
    if (event.target && event.target.classList.contains('delete-image-btn')) {
      const inputGroup = event.target.closest('.image-input-group');
      inputGroup.remove();
    }
  });
