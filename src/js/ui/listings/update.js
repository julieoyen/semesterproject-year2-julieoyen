import { API_AUCTION_LISTINGS } from '../../utilities/constants';
import { headers } from '../../utilities/headers';
import { getIDFromURL, getMyToken } from '../../utilities/getInfo';

const id = getIDFromURL();
const apiUrl = `${API_AUCTION_LISTINGS}/${id}`;

export async function onUpdateListing() {
  const token = getMyToken();

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
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
    const listingData = await response.json();
    populateForm(listingData.data);
  } catch (error) {
    console.error('Error fetching listing:', error);
  }
}

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

const imageUrlContainer = document.getElementById('image-url-container');
const addImageUrlButton = document.getElementById('add-image-url');

function createImageInputGroup(url = '', alt = '') {
  const inputGroup = document.createElement('div');
  inputGroup.className = 'image-input-group';
  inputGroup.innerHTML = `
    <div class="image-preview mt-4 flex justify-center">
      <img
        src="${url}"
        alt="${alt}"
        class="w-full max-h-64 max-w-64 flex object-contain mb-2"
        "
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
      class="delete-image-btn mt-2 py-1 px-3 shadow-md border-2 rounded-lg text-button border-button bg-transparent hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      Delete
    </button>
  `;
  return inputGroup;
}

addImageUrlButton.addEventListener('click', () => {
  if (imageUrlContainer.children.length < 8) {
    const newInputGroup = createImageInputGroup();
    imageUrlContainer.appendChild(newInputGroup);
  } else {
    alert('You can add a maximum of 8 images.');
  }
});

imageUrlContainer.addEventListener('click', (event) => {
  if (event.target && event.target.classList.contains('delete-image-btn')) {
    const inputGroup = event.target.closest('.image-input-group');
    inputGroup.remove();
  }
});

const listingMedia = [];

listingMedia.forEach((media) => {
  const newInputGroup = createImageInputGroup(media.url, media.alt);
  imageUrlContainer.appendChild(newInputGroup);
});
