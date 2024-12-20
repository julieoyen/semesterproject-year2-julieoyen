// updateProfile.js
import { getKey } from '../auth/key';
import { getMyName } from '../../utilities/getInfo.js';
import { API_KEY, API_AUCTION_PROFILES } from '../../utilities/constants';

/**
 * Updates the user profile with the provided bio, avatar, and banner information.
 *
 * @param {string} bio - The user's bio to be updated.
 * @param {Object} param1 - An object containing avatar and banner URLs.
 * @param {Object} param1.avatar - The URL of the user's avatar.
 * @param {Object} param1.banner - The URL of the user's banner.
 * @returns {Promise<Object>} - The updated profile data.
 * @throws {Error} - Throws an error if the update fails.
 */
export async function updateProfile(bio, { avatar, banner }) {
  console.log('Starting profile update...');

  const myHeaders = new Headers();
  myHeaders.append('X-Noroff-API-Key', API_KEY);

  const token = await getKey();
  myHeaders.append('Authorization', `Bearer ${token}`);
  myHeaders.append('Content-Type', 'application/json');

  // Construct the payload dynamically
  const payload = {};

  if (bio) {
    payload.bio = bio; // Include bio if provided
  }

  if (avatar?.url) {
    payload.avatar = {
      url: avatar.url,
      alt: avatar.alt || '', // Use default alt if not provided
    };
  }

  if (banner?.url) {
    payload.banner = {
      url: banner.url,
      alt: banner.alt || '', // Use default alt if not provided
    };
  }

  // Ensure at least one property is provided
  if (Object.keys(payload).length === 0) {
    throw new Error(
      'At least one property (bio, avatar, or banner) must be provided.'
    );
  }

  console.log('Payload to be sent:', JSON.stringify(payload));

  const username = getMyName();
  const url = `${API_AUCTION_PROFILES}/${username}`;

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: myHeaders,
      body: JSON.stringify(payload),
      redirect: 'follow',
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Response error text:', errorText);
      throw new Error(`Failed to update profile: ${errorText}`);
    }

    const updatedProfile = await response.json();
    console.log('Profile updated successfully:', updatedProfile);
    return updatedProfile;
  } catch (error) {
    console.error('Error updating profile:', error.message);
    throw error;
  }
}
