import { submitListing } from '../../api/listings/create';
import { showToast } from '../../utilities/toast';

/**
 * Handles the creation of a new listing.
 * @param {Event} event - The form submission event triggered by the create listing form.
 */
export async function onCreateListing(event) {
  event.preventDefault();
  const form = event.target;

  const errorContainer = document.getElementById('error-container');
  errorContainer.innerHTML = '';
  errorContainer.classList.add('hidden');

  Array.from(form.elements).forEach((field) => {
    field.classList.remove('border-red-500');
  });

  try {
    const formData = extractFormData(form);
    validateFormData(formData);

    await createListing(formData);
    showToast('Listing created successfully!');
    setTimeout(() => {
      window.location.href = history.go(-1);
    }, 3000);
  } catch (error) {
    errorContainer.innerHTML = `<p>${error.message}</p>`;
    errorContainer.classList.remove('hidden');

    if (error.message.includes('Title')) {
      form.title.classList.add('border-red-500');
    }
    if (error.message.includes('Description')) {
      form.description.classList.add('border-red-500');
    }
    if (error.message.includes('image URL')) {
      Array.from(form.querySelectorAll('input[name="imageUrl"]')).forEach(
        (input) => input.classList.add('border-red-500')
      );
    }
    if (error.message.includes('EndsAt')) {
      form['bid-ends'].classList.add('border-red-500');
    }
  }
}

/**
 * Extracts form data from the create listing form.
 * @param {HTMLFormElement} form - The form element containing listing data.
 * @returns {Object} An object containing the extracted listing data.
 */
export function extractFormData(form) {
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
 * @param {Object} data - The extracted listing data.
 * @throws Will throw an error if validation fails.
 */
export function validateFormData({ title, description, media, endsAt }) {
  if (!title || title.trim().length < 0) {
    throw new Error('Title cannot be empty');
  }
  if (!description || description.trim().length < 0) {
    throw new Error('Description cannot be empty.');
  }
  if (!media || media.some((url) => !url.startsWith('http'))) {
    throw new Error('All image URLs must start with "http" or "https".');
  }
  if (!endsAt || isNaN(Date.parse(endsAt))) {
    throw new Error('Please provide a valid end date and time.');
  }
}

/**
 * Submits the validated listing data to the backend API.
 * @param {Object} data - The listing data to submit.
 * @returns {Promise<void>} Resolves when the listing is successfully created.
 */
async function createListing({
  title,
  description,
  tags,
  media,
  altMedia,
  endsAt,
}) {
  await submitListing({
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
    const imageGroups = container.querySelectorAll('.image-input-group');

    if (imageGroups.length === 1) {
      const [imageUrlInput, imageAltInput] =
        imageGroups[0].querySelectorAll('input');
      imageUrlInput.value = '';
      imageAltInput.value = '';
    } else if (imageGroups.length > 1) {
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

document.forms.createPost.addEventListener('input', (event) => {
  const field = event.target;
  field.classList.remove('border-red-500');
});
