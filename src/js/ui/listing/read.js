import { fetchProfileData } from '../../api/profile/read';
import { getMyName } from '../../utilities/getInfo';
import { renderAuctionCard } from '../../components/card';
import {
  getAllListings,
  getAllFilterTags,
  getCurrentPage,
  setCurrentPage,
  updatePaginationButtons,
} from '../../utilities/pagination';
import { initSearchBar } from '../../utilities/searchBar';

/**
 * Render the profile page
 * @param {string} profileName - The name of the profile to render
 */
export async function renderProfilePage(profileName) {
  const isOwner = getMyName() === profileName;

  try {
    // Fetch profile data with listings included
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
      credits,
      listings,
      wins = [],
    } = profileResponse.data;

    // Profile container
    const profileContainer = document.querySelector('#profile-container');
    if (!profileContainer) {
      console.error('Profile container not found.');
      return;
    }

    // Render profile header
    profileContainer.innerHTML = `
      <div class="profile-header bg-white shadow rounded-lg p-6">
        <div class="flex items-center">
          <img src="${avatar?.url || '/images/default-avatar.png'}" 
               alt="${avatar?.alt || 'Avatar'}" 
               class="w-16 h-16 rounded-full mr-4">
          <div>
            <h1 class="text-xl font-bold">${name}</h1>
            <p>${bio || 'No bio available.'}</p>
            <p class="text-sm text-gray-500">Credits: ${credits}</p>
            <p class="text-sm text-gray-500">Wins: ${wins}</p>
          </div>
        </div>
        ${
          isOwner
            ? `<button class="edit-profile-btn bg-blue-500 text-white px-4 py-2 rounded mt-4">Edit Profile</button>`
            : ''
        }
      </div>
    `;

    // Render profile listings
    const listingsContainer = document.querySelector('#listings-container');
    if (listingsContainer) {
      listingsContainer.innerHTML = '';
      if (listings.length > 0) {
        listings.forEach((listing) => {
          renderAuctionCard(
            { ...listing, seller: { name, avatar }, isOwner },
            listingsContainer
          );
        });
      } else {
        listingsContainer.innerHTML =
          '<p class="text-center text-gray-500">No listings available.</p>';
      }
    }
  } catch (error) {
    console.error('Error rendering profile page:', error.message);
    document.body.innerHTML =
      '<p class="text-center text-red-500">An error occurred while loading the profile. Please try again later.</p>';
  }
}

/**
 * Render pagination numbers and manage page display
 * @param {number} totalItems - Total number of items
 * @param {number} itemsPerPage - Number of items per page
 * @param {function} fetchAndRenderAuctions - Function to fetch and render auctions
 */
function renderPaginationNumbers(
  totalItems,
  itemsPerPage,
  fetchAndRenderAuctions
) {
  const paginationContainer = document.getElementById('pagination-container');
  const currentPageDisplay = document.querySelector(
    '#pagination-container p strong:first-of-type'
  );
  const totalPageDisplay = document.querySelector(
    '#pagination-container p strong:last-of-type'
  );

  if (!paginationContainer || !currentPageDisplay || !totalPageDisplay) {
    console.error('Pagination container or display elements not found');
    return;
  }

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentPage = getCurrentPage();

  // Update page display
  currentPageDisplay.textContent = currentPage;
  totalPageDisplay.textContent = totalPages;

  // Manage previous and next button states
  const prevButton = document.getElementById('prev-button');
  const nextButton = document.getElementById('next-button');

  prevButton.disabled = currentPage <= 1;
  nextButton.disabled = currentPage >= totalPages;

  prevButton.addEventListener('click', async () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      await fetchAndRenderAuctions(); // Fetch and render for the new page
    }
  });

  nextButton.addEventListener('click', async () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      await fetchAndRenderAuctions(); // Fetch and render for the new page
    }
  });
}

/**
 * Fetch and render auctions based on the current page, filters, and sort options
 * @param {string|null} tag - Selected tag for filtering (null for no filter)
 * @param {boolean} isActive - Active status filter
 * @param {string} sortBy - Field to sort by ('endsAt', 'created', 'highestBid')
 */
async function fetchAndRenderAuctions(
  tag = null,
  isActive = true,
  sortBy = 'endsAt'
) {
  const container = document.getElementById('auction-card-container');
  const currentPage = getCurrentPage();

  if (!container) {
    console.error('Container element not found');
    return;
  }

  const loading = document.createElement('p');
  loading.id = 'loading';
  loading.className = 'text-center text-gray-500';
  loading.textContent = 'Loading auctions...';
  container.innerHTML = ''; // Clear previous content
  container.appendChild(loading);

  try {
    // Fetch listings or filtered listings
    const auctionResults = tag
      ? await getAllFilterTags(currentPage, tag)
      : await getAllListings(currentPage);

    const allAuctions = auctionResults.data; // Assuming data is in 'data' property
    const totalItems = auctionResults.totalCount; // Assuming the total count is provided

    loading.remove(); // Remove loading message

    if (Array.isArray(allAuctions) && allAuctions.length > 0) {
      allAuctions.forEach((auction) => {
        renderAuctionCard(auction, container);
      });

      // Render pagination numbers here
      renderPaginationNumbers(totalItems, 12, fetchAndRenderAuctions); // Assuming 12 items per page

      // Update pagination buttons
      updatePaginationButtons(currentPage, totalItems);
    } else {
      container.innerHTML =
        '<p class="text-center text-gray-500">No auctions available.</p>';
    }
  } catch (error) {
    console.error('Error fetching auctions:', error);
    loading.remove();
    container.innerHTML =
      '<p class="text-center text-red-500">Error loading auctions. Please try again later.</p>';
  }
}

/**
 * Initialize the auction listings page
 */

function initListingsPage() {
  fetchAndRenderAuctions(); // Initial fetch and render
  setupPaginationButtons(fetchAndRenderAuctions); // Set up pagination buttons
  initSearchBar((searchedAuctions) => {
    const container = document.getElementById('auction-card-container');
    if (!container) {
      console.error('Container element not found');
      return;
    }

    container.innerHTML = ''; // Clear previous content
    if (searchedAuctions.length > 0) {
      searchedAuctions.forEach((auction) => {
        renderAuctionCard(auction, container);
      });
    } else {
      container.innerHTML =
        '<p class="text-center text-gray-500">No auctions found matching your search.</p>';
    }
  });
}

// Call the initialization function
initListingsPage();
