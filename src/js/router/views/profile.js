import { initMenu } from '../../utilities/hamburgerMenu';
import { renderHeader } from '../../components/header';
import { API_AUCTION_PROFILES } from '../../utilities/constants';
import { getMyName, getNameFromURL } from '../../utilities/getInfo';
import { readProfile } from '../../api/profile/read';
import { timeSincePosted, timeUntilEnds } from '../../utilities/formatDate';

renderHeader();
initMenu();

async function renderProfilePage(profileData, isOwner) {
  const container = document.getElementById('profile-container');

  if (!container) {
    console.error('Profile container not found');
    return;
  }

  const username = getNameFromURL();
  const loggedInUsername = getMyName();

  if (!username) {
    container.innerHTML = `<p class="text-red-500 text-center">Invalid profile URL.</p>`;
    return;
  }

  const profileInfo = await readProfile(username);
  if (!profileInfo) {
    container.innerHTML = `
      <p class="text-red-500 text-center">Failed to load profile. Please try again later.</p>
    `;
    return;
  }

  isOwner = loggedInUsername === username;
  const { name, avatar, bio, _count, credits } = profileData;

  container.innerHTML = `
    <div class="text-center p-4">
      <div class="relative w-full h-48 bg-gray-200">
        <img src="${avatar?.url || '/images/default-banner.jpg'}" 
             alt="${avatar?.alt || 'Banner'}" 
             class="w-full h-full object-cover">
      </div>
      <img src="${avatar?.url || '/images/default-avatar.png'}" 
           alt="${avatar?.alt || 'User Avatar'}" 
           class="w-24 h-24 rounded-full mx-auto border-4 border-white shadow-lg mt-[-3rem]">
      <h1 class="text-2xl font-bold mt-2">${name || 'Anonymous User'}</h1>
      <p class="text-gray-600">${bio || 'No bio provided.'}</p>
      ${
        isOwner
          ? `<p class="text-gray-800 font-medium mt-2">Credits: ${credits || 0}</p>`
          : ''
      }
      <div class="mt-4 flex justify-center space-x-8">
        <div>
          <p class="text-lg font-bold">${_count?.listings || 0}</p>
          <p class="text-sm text-gray-500">Listings</p>
        </div>
        <div>
          <p class="text-lg font-bold">${_count?.wins || 0}</p>
          <p class="text-sm text-gray-500">Wins</p>
        </div>
      </div>
      ${
        isOwner
          ? `<div class="mt-6">
               <button class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
                 Edit Profile
               </button>
               <button class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition ml-4">
                 Create Listing
               </button>
             </div>`
          : ''
      }
    </div>
  `;
}

renderProfilePage();
