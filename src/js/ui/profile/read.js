import { fetchProfileData } from '../../api/profile/read';
import { renderAuctionCard } from '../../components/card';
import { getMyName } from '../../utilities/getInfo';
import { updateProfile } from '../../api/profile/update';
import {
  setupModalHandlers,
  closeModal,
  openModal,
} from '../../components/modal';

import { initMenu } from '../../utilities/hamburgerMenu';

initMenu();

/**
 * Render the profile page
 * @param {string} profileName - The name of the profile to render
 */
export async function renderProfilePage(profileName) {
  const isOwner = getMyName() === profileName;

  try {
    const profileResponse = await fetchProfileData(profileName, {
      _listings: true,
    });

    if (!profileResponse || !profileResponse.data) {
      document.body.innerHTML =
        '<p class="text-center text-red-500">Failed to load profile. Please try again later.</p>';
      return;
    }

    const {
      name,
      bio,
      avatar,
      banner,
      credits,
      listings = [],
    } = profileResponse.data;

    let winsCount = 0;
    let bidsCount = 0;

    // Fetch wins and bids if the user is the owner
    if (isOwner) {
      winsCount = (await fetchProfileWins(profileName))?.length || 0;
      bidsCount = (await fetchProfileBids(profileName))?.length || 0;
    }

    const profileContainer = document.querySelector('#profile-container');
    if (!profileContainer) {
      console.error('Profile container not found.');
      return;
    }

    // Render Profile Header and Modals
    profileContainer.innerHTML = `
      <div class="profile-header grid grid-cols-1 align-middle gap-y-4 gap-x-4 bg-white p-11 relative">
        ${
          isOwner
            ? `<button 
                 class="edit-banner-btn absolute top-2 right-2 bg-button hover:bg-button-hover text-white text-sm px-2 py-1 rounded-full shadow-md"
                 aria-label="Edit Banner">
                 ✏️
               </button>`
            : ''
        }
        <div class="flex flex-col items-center justify-center relative">
          <div class="relative">
            <img src="${avatar?.url || '/images/default-avatar.png'}" 
                 alt="${avatar?.alt || 'Avatar'}" 
                 class="w-52 h-52 rounded-full">
          </div>          
          <div class="">
          <div class="bg-white p-4 shadow-lg rounded-lg mt-2">

          <div class="flex align-middle justify-center border-b mb-4 border-gray-200 ">
            <h1 class="text-2xl text-black font-bold ">${name}</h1>
          </div>

          <p id="bio-text" class="text-sm text-gray-500 mt-4">${bio || 'No bio available.'}</p>
          </div>
          ${
            isOwner
              ? `
              <div class="flex mt-4 text-sm gap-2 text-gray-700">
                <button class="bg-button text-white px-4 py-2 rounded hover:bg-button-hover">Listings: ${listings.length}</button>
                <button class="bg-button text-white px-4 py-2 rounded hover:bg-button-hover">Wins: ${winsCount}</button>
                <button class="bg-button text-white px-4 py-2 rounded hover:bg-button-hover">Bids: ${bidsCount}</button>

              </div>
              `
              : ''
          }
        </div>
      </div>

      <!-- Banner Modal -->
<div id="banner-modal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center hidden z-50">
  <div class="bg-white rounded-lg p-6 w-96 shadow-lg relative">
    <button id="close-banner-modal" class="absolute top-2 right-2 text-gray-500 hover:text-gray-800">✖</button>
    <h2 class="text-xl text-black font-bold mb-4">Edit Profile</h2>
    <form id="edit-banner-form">
      <!-- Avatar URL -->
      <label for="avatar-url" class="block text-sm font-medium text-gray-700">Avatar URL</label>
      <input type="url" id="avatar-url" name="avatar-url" placeholder="Enter avatar URL" class="mt-1 p-2 border text-black border-gray-300 rounded w-full">

      <!-- Banner URL -->
      <label for="banner-url" class="block text-sm font-medium text-gray-700 mt-4">Banner URL</label>
      <input type="url" id="banner-url" name="banner-url" placeholder="Enter banner URL" class="mt-1 p-2 border text-black border-gray-300 rounded w-full">

      <!-- Bio -->
      <label for="bio-textarea" class="block text-sm font-medium text-gray-700 mt-4">Bio</label>
      <textarea id="bio-textarea" name="bio-textarea" placeholder="Enter bio" class="mt-1 p-2 border text-black border-gray-300 rounded w-full" rows="4"></textarea>

      <div class="mt-4 flex justify-end">
        <button type="button" id="cancel-banner-button" class="bg-gray-500 text-white px-4 py-2 rounded mr-2">Cancel</button>
        <button type="submit" class="bg-button hover:bg-button-hover text-white px-4 py-2 rounded">Save</button>
      </div>
    </form>
  </div>
</div>

    `;

    setupModalHandlers(
      {
        modalId: 'banner-modal', // Or 'avatar-modal'
        triggerClass: '.edit-banner-btn', // Or '.edit-avatar-btn'
        closeId: 'close-banner-modal', // Or 'close-avatar-modal'
        cancelId: 'cancel-banner-button', // Or 'cancel-avatar-button'
        formId: 'edit-banner-form', // Or 'edit-avatar-form'
      },
      (modal, form) => {
        const bioText = document.getElementById('bio-text')?.textContent || '';
        const avatarUrl =
          document.querySelector('.profile-header img')?.src || '';
        const bannerStyle =
          document.querySelector('.profile-header').style.backgroundImage;
        const bannerUrl = bannerStyle?.slice(5, -2) || '';

        // Dynamically pre-fill based on the modal
        if (modal.id === 'banner-modal') {
          form.querySelector('#banner-url').value = bannerUrl;
          form.querySelector('#bio-textarea').value = bioText;
          form.querySelector('#avatar-url').value = avatarUrl;
        } else if (modal.id === 'avatar-modal') {
          form.querySelector('#avatar-url').value = avatarUrl;
          form.querySelector('#bio-textarea').value = bioText;
        }
      },
      async (formData, modal) => {
        try {
          const avatarUrl = formData.get('avatar-url') || '';
          const bannerUrl = formData.get('banner-url') || '';
          const bioText = formData.get('bio-textarea') || '';

          console.log('Parsed FormData:', { avatarUrl, bannerUrl, bioText });

          // Call `updateProfile` dynamically based on modal
          if (modal.id === 'banner-modal') {
            await updateProfile(bioText, {
              avatar: avatarUrl,
              banner: bannerUrl,
            });
          } else if (modal.id === 'avatar-modal') {
            await updateProfile(bioText, { avatar: avatarUrl });
          }

          // Update the UI
          const profileHeader = document.querySelector('.profile-header');
          const avatarImg = profileHeader.querySelector('img');

          if (modal.id === 'banner-modal' || modal.id === 'avatar-modal') {
            avatarImg.src = avatarUrl;
            profileHeader.style.backgroundImage = `url(${bannerUrl})`;
            profileHeader.style.backgroundSize = 'cover';
            profileHeader.style.backgroundPosition = 'center';
            document.getElementById('bio-text').textContent = bioText;
          }

          closeModal(modal);
          renderProfilePage(getMyName());
        } catch (error) {
          console.error('Failed to update profile:', error.message);
        }
      }
    );

    // Apply Banner Background
    const bannerImage = document.querySelector('.profile-header');
    if (bannerImage && banner?.url) {
      bannerImage.style.backgroundImage = `url(${banner.url})`;
      bannerImage.style.backgroundSize = 'cover';
      bannerImage.style.backgroundPosition = 'center';
    }

    // Render Listings
    await renderSection(
      'Listings',
      listings.map((listing) => ({
        ...listing,
        seller: { name, avatar }, // Add seller info for cards
      })),
      '#listings-container',
      isOwner
    );
  } catch (error) {
    console.error('Error rendering profile page:', error.message);
    document.body.innerHTML =
      '<p class="text-center text-red-500">An error occurred while loading the profile. Please try again later.</p>';
  }
}

async function fetchProfileWins(profileName) {
  try {
    const response = await fetch(`/auction/profilee/${profileName}/wins`);
    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`No wins found for profile: ${profileName}`);
        return [];
      }
      throw new Error(`Failed to fetch wins: ${response.statusText}`);
    }
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error fetching wins:', error.message);
    return [];
  }
}

async function fetchProfileBids(profileName) {
  try {
    const response = await fetch(`/auction/profiles/${profileName}/bids`);
    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`No bids found for profile: ${profileName}`);
        return []; // Treat 404 as no bids
      }
      throw new Error(`Failed to fetch bids: ${response.statusText}`);
    }
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error fetching bids:', error.message);
    return [];
  }
}

/**
 * Render a section (listings, wins, or bids)
 * @param {string} title - The section title
 * @param {Array} items - The items to render
 * @param {string} containerSelector - The container selector
 * @param {boolean} isOwner - Whether the user is the owner
 */
async function renderSection(title, items, containerSelector, isOwner) {
  const container = document.querySelector(containerSelector);
  if (!container) {
    console.error(`Container for ${title} not found.`);
    return;
  }

  container.innerHTML = `<h2 class="text-lg font-bold">${title}</h2>`;
  if (items.length > 0) {
    items.forEach((item) => {
      renderAuctionCard(item, container);
    });
  } else {
    container.innerHTML += `<p class="text-center text-gray-500">No ${title.toLowerCase()} available.</p>`;
  }
}
