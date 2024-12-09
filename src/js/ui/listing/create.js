import { createListing } from '../../api/listing/create';

const VALID_TAGS = ['art', 'watches', 'vintage', 'jewelry'];

export async function onCreateListing(event) {
  event.preventDefault();

  const form = event.target;

  try {
    const formData = extractFormData(form);

    validateFormData(formData);
    await submitListing(formData);
    window.alert('Listing created successfully!');
    window.location.href = '/';
  } catch (error) {
    handleError(error);
  }
}

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
    tag: form['list-radio'].value.trim(),
    media: imageUrls,
    altMedia: imageAlts,
    endsAt: form['bid-ends'].value.trim(),
  };
}

function validateFormData({ title, description, tag }) {
  if (!title || !description) {
    throw new Error('Title and description are required.');
  }
  if (description.length > 280) {
    throw new Error('Description cannot exceed 280 characters.');
  }
  if (!VALID_TAGS.includes(tag)) {
    throw new Error('Please select a valid tag.');
  }
}

async function submitListing({
  title,
  description,
  tag,
  media,
  altMedia,
  endsAt,
}) {
  await createListing({
    title,
    description,
    tags: [tag],
    media: media.map((url, index) => ({ url, alt: altMedia[index] })),
    endsAt,
  });
}

function handleError(error) {
  console.error('Error creating listing:', error);
  window.alert(error.message || 'Failed to create listing. Please try again.');
}

document.getElementById('add-image-url').addEventListener('click', function () {
  const container = document.getElementById('image-url-container');
  const newInputGroup = document.createElement('div');
  newInputGroup.className = 'image-input-group mb-2';

  const newImageUrlInput = document.createElement('input');
  newImageUrlInput.type = 'text';
  newImageUrlInput.name = 'imageUrl';
  newImageUrlInput.className =
    'mt-1 block w-full rounded-md border-2 border-gray-300 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2 text-sm sm:text-base';
  newImageUrlInput.placeholder = 'Enter image URL';
  newImageUrlInput.required = true;

  const newImageAltInput = document.createElement('input');
  newImageAltInput.type = 'text';
  newImageAltInput.name = 'imageAlt';
  newImageAltInput.className =
    'mt-1 block w-full rounded-md border-2 border-gray-300 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2 text-sm sm:text-base';
  newImageAltInput.placeholder = 'Enter image alt text';
  newImageAltInput.required = true;

  newInputGroup.appendChild(newImageUrlInput);
  newInputGroup.appendChild(newImageAltInput);
  container.appendChild(newInputGroup);
});
