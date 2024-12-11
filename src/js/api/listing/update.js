import { getIDFromURL, getMyName, getMyToken } from '../../utilities/getInfo';
import { API_AUCTION_LISTINGS, API_KEY } from '../../utilities/constants';
import { getMyToken } from '../../utilities/getInfo';
import { headers } from '../../utilities/headers';

const postId = getIDFromURL();

export async function submitEditForm(event) {
  event.preventDefault();

  const token = await getMyToken();

  const updatedPostData = {
    title: document.getElementById('title').value,
    description: document.getElementById('description').value,
    tags: document
      .getElementById('tags')
      .value.split(',')
      .map((tag) => tag.trim()),
    media: {
      url: document.getElementById('image').value,
      alt: document.getElementById('imageAlt').value,
    },
  };

  try {
    const response = await fetch(`${API_AUCTION_LISTINGS}/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...headers(),
      },
      body: JSON.stringify(updatedPostData),
    });

    if (!response.ok) {
      throw new Error('Failed to update post');
    }

    await response.json();
    window.location.replace(`/profile/?author=${getMyName()}`);
  } catch (error) {
    throw new Error('Error updating post: ' + error.message);
  }
}
