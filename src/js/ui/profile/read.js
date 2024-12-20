import { renderAuctionCard } from '../../components/card';
import { setupModalHandlers, closeModal } from '../../components/modal';
import { updateProfile } from '../../api/profile/update';
import { getMyName } from '../../utilities/getInfo';
import { showToast } from '../../utilities/toast';

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

  document.title = isOwner ? 'Your Profile' : `${name}'s Listings`;

  profileContainer.innerHTML = `
    <div class="profile-header relative bg-gray-200 min-h-[300px] flex flex-col items-center justify-center"
         style="background: url('${banner?.url || '/images/default-banner.jpg'}') center/cover no-repeat;">
      ${isOwner ? `<button class="edit-banner-btn absolute top-2 right-2 bg-button hover:bg-button-hover text-white px-4 py-1 rounded-full shadow-md" aria-label="Edit Profile">✏️ Edit</button>` : ''}
      <div class="relative mt-8">
        <img src="${avatar?.url || '/images/default-avatar.png'}" 
             alt="${avatar?.alt || 'Avatar'}" 
             class="w-32 h-32 object-cover rounded-full border-4 border-white shadow-lg">
      </div>
      <div class="flex flex-col bg-white p-4 m-4 rounded-lg min-w-[200px]">
        <h1 class="font-bebas flex justify-center text-4xl text-black font-bold pb-3">${name}</h1>
        <p class="text-black text-sm my-2">${bio || 'No bio available.'}</p>
      </div>
      ${
        isOwner
          ? `<div class="flex my-4 text-sm gap-4 text-gray-700">
                    <button id="listings-btn" class="bg-button text-white px-4 py-2 rounded">Listings: ${listings.length}</button>
                    <button id="wins-btn" class="bg-button text-white px-4 py-2 rounded">Wins: ${wins.length}</button>
                    <button id="bids-btn" class="bg-button text-white px-4 py-2 rounded">Bids: ${bids.length}</button>
                  </div>`
          : ''
      }
    </div>

    <div id="edit-modal" class="hidden fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white text-black p-6 rounded-lg shadow-lg w-full max-w-md relative">
        <button id="close-edit-modal" class="absolute top-2 right-2 text-gray-500 hover:text-gray-800">✖</button>
        <h2 class="text-xl font-semibold mb-4">Edit Profile</h2>
        <form id="edit-form">
          <label for="bio" class="block text-sm font-medium text-gray-700">Bio</label>
          <input id="bio" name="bio" placeholder="Enter bio" class="w-full mt-1 p-2 border rounded" value="${bio || ''}">
          <label for="avatar-url" class="block text-sm font-medium text-gray-700 mt-4">Avatar URL</label>
          <input type="url" id="avatar-url" name="avatar-url" placeholder="Enter avatar URL" class="w-full mt-1 p-2 border rounded" value="${avatar?.url || ''}">
          <label for="banner-url" class="block text-sm font-medium text-gray-700 mt-4">Banner URL</label>
          <input type="url" id="banner-url" name="banner-url" placeholder="Enter banner URL" class="w-full mt-1 p-2 border rounded" value="${banner?.url || ''}">
          <button type="submit" class="mt-4 bg-button text-white px-4 py-2 rounded hover:bg-button-hover">Save</button>
        </form>
      </div>
    </div>
              <div
          id="toast"
          class="hidden font-roboto font-semibold fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl bg-background-dark dark:bg-background-light text-white dark:text-background-dark py-12 px-12 rounded-lg shadow-lg transition-opacity duration-300 opacity-0"
        ></div>

    <div id="listings-container" class="mt-8"></div>
    ${isOwner ? `<div id="wins-container" class="mt-8"></div>` : ''}
    ${isOwner ? `<div id="bids-container" class="mt-8"></div>` : ''}
  `;

  if (isOwner) {
    document.getElementById('listings-btn').addEventListener('click', () => {
      document
        .getElementById('listings-container')
        .scrollIntoView({ behavior: 'smooth' });
    });

    document.getElementById('wins-btn').addEventListener('click', () => {
      document
        .getElementById('wins-container')
        .scrollIntoView({ behavior: 'smooth' });
    });

    document.getElementById('bids-btn').addEventListener('click', () => {
      document
        .getElementById('bids-container')
        .scrollIntoView({ behavior: 'smooth' });
    });
  }

  if (listings && listings.length > 0) {
    renderSection(
      isOwner ? 'Your listings' : `${name}'s listings`,
      listings,
      'listings-container',
      'No listings available.'
    );
  } else {
    document.getElementById('listings-container').innerHTML =
      `<p class="text-gray-500">No listings available.</p>`;
  }

  if (isOwner) {
    renderSection('Listings You Won', wins, 'wins-container', 'No wins yet.');
  }
  if (isOwner) {
    renderSection('Your Bids', bids, 'bids-container', 'No active bids.');
  }
}

/**
 * Renders a section of auction cards
 */
export function renderSection(title, items, containerId, emptyMessage) {
  const section = document.createElement('section');
  section.className = 'my-6';
  section.innerHTML = `
    <h3 class="text-4xl font-bebas font-semibold mb-3 text-center">${title}</h3>
    <div id="${containerId}" class="flex flex-wrap gap-4 justify-center"></div>`;
  document.getElementById(containerId).replaceWith(section);

  const container = document.getElementById(containerId);
  if (title === 'Your Bids') {
    items.forEach((bid) => {
      const listing = bid.listing || {};
      const seller = listing.seller || {
        name: 'Unknown Seller',
        avatar: { url: '/images/default-avatar.png' },
      };
      const enrichedItem = {
        ...listing,
        bids: [{ amount: bid.amount, created: bid.created }],
        seller,
      };

      renderAuctionCard(enrichedItem, container);
    });
  } else {
    items.forEach((item) => {
      renderAuctionCard(item, container);
    });
  }

  if (!items?.length) {
    container.innerHTML = `<p class="text-gray-500">${emptyMessage}</p>`;
  }
}
