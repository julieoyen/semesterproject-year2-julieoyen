import { getKey } from '../auth/key';
import { getMyName } from '../../utilities/getInfo.js';
import { API_KEY, API_AUCTION_PROFILES } from '../../utilities/constants';

/**
 * Updates the user profile with the provided bio, avatar, and banner information.
 *
 * @param {string} bio - The user's bio to be updated.
 * @param {Object} param1 - An object containing avatar and banner URLs.
 * @param {string} param1.avatar - The URL of the user's avatar.
 * @param {string} param1.banner - The URL of the user's banner.
 * @returns {Promise<Object>} - The updated profile data.
 * @throws {Error} - Throws an error if the update fails.
 */
export async function updateProfile(bio, { avatar, banner }) {
  const myHeaders = new Headers();
  myHeaders.append('X-Noroff-API-Key', API_KEY);

  const token = await getKey();
  myHeaders.append('Authorization', `Bearer ${token}`);
  myHeaders.append('Content-Type', 'application/json');

  if (avatar && !isValidUrl(avatar)) {
    throw new Error('Invalid avatar URL provided.');
  }

  if (banner && !isValidUrl(banner)) {
    throw new Error('Invalid banner URL provided.');
  }

  const oldData = {
    avatar: avatar ? { url: avatar, alt: '' } : undefined,
    banner: banner ? { url: banner, alt: '' } : undefined,
    bio: bio,
  };

  const infoOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: JSON.stringify(oldData),
    redirect: 'follow',
  };

  const username = getMyName();
  const url = `${API_AUCTION_PROFILES}/${username}`;

  try {
    const response = await fetch(url, infoOptions);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update profile: ${errorText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating profile:', error.message);
    throw error;
  }
}

function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
