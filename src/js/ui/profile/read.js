import { renderAuctionCard } from '../../components/card';
import { setupModalHandlers, closeModal } from '../../components/modal';
import { updateProfile } from '../../api/profile/update';
import { getMyName } from '../../utilities/getInfo';

/**
 * Renders the profile page with profile data, listings, wins, and bids.
 * @param {Object} profile - Profile details.
 * @param {Array} listings - Listings created by the user.
 * @param {Array} wins - Listings won by the user.
 * @param {Array} bids - Bids made by the user.
 */
export function renderProfilePage(profile, listings, wins, bids) {
  const { name, avatar, banner, bio } = profile;

  const isOwner = getMyName() === name;

  const profileContainer = document.getElementById('profile-container');

  // Render Profile Header with Totals
  profileContainer.innerHTML = `
    <div class="profile-header relative bg-gray-200 min-h-[300px] flex flex-col items-center justify-center"
         style="background: url('${banner?.url || '/images/default-banner.jpg'}') center/cover no-repeat;">
      ${
        isOwner
          ? `<button 
               class="edit-banner-btn absolute top-2 right-2 bg-button hover:bg-button-hover text-white px-4 py-1 rounded-full shadow-md"
               aria-label="Edit Profile">
               ✏️ Edit
             </button>`
          : ''
      }
      <div class="relative mt-8">
        <img src="${avatar?.url || '/images/default-avatar.png'}" 
             alt="${avatar?.alt || 'Avatar'}" 
             class="w-32 h-32 object-cover rounded-full border-4 border-white shadow-lg">
      </div>
      <h1 class="text-3xl text-white font-bold mt-4">${name}</h1>
      <p class="text-white text-sm mt-2">${bio || 'No bio available.'}</p>
      ${
        isOwner
          ? `
        <div class="flex mt-4 text-sm gap-4 text-gray-700">
          <button class="bg-button text-white px-4 py-2 rounded">Listings: ${listings.length}</button>
          <button class="bg-button text-white px-4 py-2 rounded">Wins: ${wins.length}</button>
          <button class="bg-button text-white px-4 py-2 rounded">Bids: ${bids.length}</button>
        </div>`
          : ''
      }
    </div>

    <!-- Modal -->
    <div id="edit-modal" class="hidden fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white text-black p-6 rounded-lg shadow-lg w-full max-w-md relative">
        <button id="close-edit-modal" class="absolute top-2 right-2 text-gray-500 hover:text-gray-800">✖</button>
        <h2 class="text-xl font-semibold mb-4">Edit Profile</h2>
        <form id="edit-form">
          <label for="avatar-url" class="block text-sm font-medium text-gray-700">Avatar URL</label>
          <input type="url" id="avatar-url" placeholder="Enter avatar URL" class="w-full mt-1 p-2 border rounded">

          <label for="banner-url" class="block text-sm font-medium text-gray-700 mt-4">Banner URL</label>
          <input type="url" id="banner-url" placeholder="Enter banner URL" class="w-full mt-1 p-2 border rounded">

          <button type="submit" class="mt-4 bg-button text-white px-4 py-2 rounded hover:bg-button-hover">Save</button>
        </form>
      </div>
    </div>
    
    <!-- Sections -->
    <div id="listings-container" class="mt-8"></div>
    <div id="wins-container" class="mt-8"></div>
    <div id="bids-container" class="mt-8"></div>
  `;

  // Initialize Modal Handlers Only if the User Owns the Profile
  if (isOwner) {
    setupModalHandlers(
      {
        modalId: 'edit-modal',
        triggerClass: '.edit-banner-btn',
        closeId: 'close-edit-modal',
        formId: 'edit-form',
      },
      (modal, form) => {
        // Pre-fill form with existing avatar and banner data
        form.querySelector('#avatar-url').value = avatar?.url || '';
        form.querySelector('#banner-url').value = banner?.url || '';
      },
      async (formData, modal) => {
        try {
          // Retrieve and log the new values for debugging
          const newAvatarUrl = formData.get('avatar-url')?.trim();
          const newBannerUrl = formData.get('banner-url')?.trim();

          console.log('New Avatar URL:', newAvatarUrl); // Debug
          console.log('New Banner URL:', newBannerUrl); // Debug

          // Build the payload dynamically with valid inputs
          const payload = {};
          if (newAvatarUrl && newAvatarUrl !== avatar?.url) {
            payload.avatar = { url: newAvatarUrl };
          }
          if (newBannerUrl && newBannerUrl !== banner?.url) {
            payload.banner = { url: newBannerUrl };
          }

          console.log('Payload to Update:', payload); // Debug

          // Check if payload is still empty
          if (Object.keys(payload).length === 0) {
            console.warn('No updates provided. Exiting...');
            closeModal(modal);
            return;
          }

          // Call the updateProfile function with the payload
          await updateProfile(payload);

          // Close modal and refresh the page to show changes
          closeModal(modal);
          location.reload();
        } catch (error) {
          console.error('Failed to update profile:', error.message);
          alert(
            'An error occurred while updating your profile. Please try again.'
          );
        }
      }
    );
  }

  // Render Sections
  renderSection(
    'Your Listings',
    listings,
    'listings-container',
    'No listings available.'
  );
  renderSection('Listings You Won', wins, 'wins-container', 'No wins yet.');
  renderSection(
    'Your Bids',
    bids.map((bid) => bid.listing),
    'bids-container',
    'No active bids.'
  );
}

/**
 * Renders a section of auction cards
 */
function renderSection(title, items, containerId, emptyMessage) {
  const section = document.createElement('section');
  section.className = 'my-6';
  section.innerHTML = `
    <h3 class="text-2xl font-semibold mb-3 text-center">${title}</h3>
    <div id="${containerId}" class="flex flex-wrap gap-4 justify-center"></div>
  `;
  document.getElementById(containerId).replaceWith(section);

  const container = document.getElementById(containerId);

  if (items && items.length > 0) {
    items.forEach((item) => {
      const enrichedItem = {
        ...item,
        seller: item.seller || { name: 'Unknown Seller' },
        _count: item._count || { bids: 0 },
        bids: item.bids || [{ amount: 0 }],
      };
      renderAuctionCard(enrichedItem, container);
    });
  } else {
    container.innerHTML = `<p class="text-gray-500">${emptyMessage}</p>`;
  }
}

/**
 * Checks if the logged-in user is the profile owner.
 */
function isOwner(profileName) {
  const loggedInUser = getMyName(); // Fetches logged-in username
  return loggedInUser && loggedInUser === profileName;
}
