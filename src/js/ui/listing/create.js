import { createListing } from '../../api/listing/create';
import { showToast } from '../../utilities/toast';

/**
 * Handles the creation of a new listing.
 * Extracts form data, validates it, submits it, and shows a toast on success or errors in the console on failure.
 *
 * @param {Event} event - The form submission event triggered by the create listing form.
 */
export async function onCreateListing(event) {
  event.preventDefault();

  const form = event.target;

  try {
    const formData = extractFormData(form);
    validateFormData(formData);

    await submitListing(formData);

    showToast('Listing created successfully!');

    // Redirect to the homepage after 3 seconds
    setTimeout(() => {
      window.location.href = '/';
    }, 3000);
  } catch (error) {
    console.error('Error creating listing:', error);
    // Optionally, display an error message in a general error container if needed
  }
}

/**
 * Extracts form data from the create listing form.
 *
 * @param {HTMLFormElement} form - The form element containing listing data.
 * @returns {Object} An object containing the extracted listing data.
 */
function extractFormData(form) {
  const imageUrls = Array.from(
    form.querySelectorAll('input[name="imageUrl"]')
  ).map((input) => input.value.trim());
  const imageAlts = Array.from(
    form.querySelectorAll('input[name="imageAlt"]')
  ).map((input) => input.value.trim());

  return {
    title: form.title.value.trim(),
    description: form.description.value.trim(),
    tags: form.tags.value
      .split(',')
      .map((tag) => tag.trim().toLowerCase())
      .filter((tag) => tag),
    media: imageUrls,
    altMedia: imageAlts,
    endsAt: form['bid-ends'].value.trim(),
  };
}

/**
 * Validates the extracted form data.
 *
 * @param {Object} data - The extracted listing data.
 * @throws Will throw an error if validation fails.
 */
function validateFormData({ title, description, media, endsAt }) {
  if (!title || !description) {
    throw new Error('Title and description are required.');
  }
  if (!media || media.length === 0) {
    throw new Error('At least one image URL is required.');
  }
  if (!endsAt || isNaN(Date.parse(endsAt))) {
    throw new Error('EndsAt must be a valid ISO date.');
  }
}

/**
 * Submits the validated listing data to the backend API.
 *
 * @param {Object} data - The listing data to submit.
 * @returns {Promise<void>} Resolves when the listing is successfully created.
 */
async function submitListing({
  title,
  description,
  tags,
  media,
  altMedia,
  endsAt,
}) {
  await createListing({
    title,
    description,
    tags,
    media: media.map((url, index) => ({ url, alt: altMedia[index] })),
    endsAt,
  });
}

document
  .getElementById('delete-image-url')
  .addEventListener('click', function () {
    const container = document.getElementById('image-url-container');
    if (container.children.length > 0) {
      container.removeChild(container.lastChild);
    }
  });

document.getElementById('add-image-url').addEventListener('click', function () {
  const container = document.getElementById('image-url-container');
  const newInputGroup = document.createElement('div');
  newInputGroup.className = 'image-input-group mb-2';

  const newImageUrlInput = document.createElement('input');
  newImageUrlInput.type = 'text';
  newImageUrlInput.name = 'imageUrl';
  newImageUrlInput.className =
    'mt-1 block w-full text-black rounded-md border-2 border-gray-300 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2 text-sm sm:text-base';
  newImageUrlInput.placeholder = 'Enter image URL';
  newImageUrlInput.required = true;

  const newImageAltInput = document.createElement('input');
  newImageAltInput.type = 'text';
  newImageAltInput.name = 'imageAlt';
  newImageAltInput.className =
    'mt-1 block w-full rounded-md border-2 border-gray-300 text-black focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2 text-sm sm:text-base';
  newImageAltInput.placeholder = 'Enter image alt text';
  newImageAltInput.required = true;

  newInputGroup.appendChild(newImageUrlInput);
  newInputGroup.appendChild(newImageAltInput);
  container.appendChild(newInputGroup);
});
