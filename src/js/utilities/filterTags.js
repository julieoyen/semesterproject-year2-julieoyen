import { getAllListings, getAllFilterTags } from '../utilities/pagination';
import { renderAuctionCard } from '../components/card';

let page = 1; // Current page
let currentTag = null; // Selected tag
let isActive = true; // Active status filter
let sortBy = 'endsAt'; // Default sort field

/**
 * Fetch and render auctions, and manage pagination
 * @param {string|null} tag - Selected tag (null for no tag)
 * @param {boolean} isActive - Active status filter
 * @param {string} sortBy - Field to sort by ('endsAt', 'created', 'highestBid')
 * @param {number} page - Current page
 */
export async function fetchAndRenderAuctions(
  tag = null,
  isActive = true,
  sortBy = 'endsAt',
  page = 1
) {
  const container = document.querySelector('#auction-card-container');
  container.innerHTML = '<p>Loading...</p>'; // Show loading state

  try {
    const dataResult = tag
      ? await getAllFilterTags(page, tag) // Fetch filtered data
      : await getAllListings(page); // Fetch all listings

    container.innerHTML = ''; // Clear loading state

    if (!dataResult.data || dataResult.data.length === 0) {
      container.innerHTML = '<p>No results found for the selected filter.</p>';
      return;
    }

    // Sort the auctions
    const sortedAuctions = [...dataResult.data].sort((a, b) => {
      if (sortBy === 'endsAt') return new Date(a.endsAt) - new Date(b.endsAt);
      if (sortBy === 'created')
        return new Date(b.created) - new Date(a.created);
      if (sortBy === 'highestBid')
        return (b.bids[0]?.amount || 0) - (a.bids[0]?.amount || 0);
    });

    // Render the sorted auctions
    sortedAuctions.forEach((listing) => {
      renderAuctionCard(listing, container);
    });

    // Update pagination buttons
    updatePaginationButtons(page, dataResult.data.length);
  } catch (error) {
    container.innerHTML = `<p>Error loading data: ${error.message}</p>`;
  }
}

/**
 * Update pagination button states
 * @param {number} page - Current page
 * @param {number} itemCount - Number of items returned
 */
function updatePaginationButtons(page, itemCount) {
  const prevButton = document.querySelector('#prev-button');
  const nextButton = document.querySelector('#next-button');

  if (prevButton) prevButton.disabled = page <= 1;
  if (nextButton) nextButton.disabled = itemCount < 12;
}

/**
 * Set up pagination button click events
 */
function setupPaginationButtons() {
  const prevButton = document.querySelector('#prev-button');
  const nextButton = document.querySelector('#next-button');

  if (prevButton) {
    prevButton.addEventListener('click', async () => {
      if (page > 1) {
        page--;
        await fetchAndRenderAuctions(currentTag, isActive, sortBy, page);
      }
    });
  }

  if (nextButton) {
    nextButton.addEventListener('click', async () => {
      page++;
      await fetchAndRenderAuctions(currentTag, isActive, sortBy, page);
    });
  }
}

/**
 * Initialize filter component
 * @param {string} containerId - ID of the container where filters will be rendered
 */
export function createFilterComponent(containerId) {
  const container = document.getElementById(containerId);

  if (!container) {
    console.error(`Container with ID "${containerId}" not found`);
    return;
  }

  container.innerHTML = `
    <div class="container flex flex-col justify-center p-6">
      <div class="grid justify-center p-6 rounded-lg">
        <div class="flex flex-row font-roboto font-extrabold gap-2" id="filter-tags">
          <button id="art" class="btn cursor-pointer lg:w-40 lg:h-40 rounded-lg lg:text-xl hover:text-primary">ART<img src="/images/art.png" alt="art-icon"></button>
          <button id="watches" class="btn cursor-pointer lg:w-40 lg:h-40 rounded-lg lg:text-xl hover:text-primary">WATCHES<img src="/images/watch.png" alt="watches-icon"></button>
          <button id="vintage" class="btn cursor-pointer lg:w-40 lg:h-40 rounded-lg lg:text-xl hover:text-primary">VINTAGE<img src="/images/vintage.png" alt="vintage-icon"></button>
          <button id="jewelry" class="btn cursor-pointer lg:w-40 lg:h-40 rounded-lg lg:text-xl hover:text-primary">JEWELRY<img src="/images/jewelry.png" alt="jewelry"></button>
        </div>
      </div>
      <div class="grid justify-center pb-2">
        <div class="mt-4 flex justify-center text-white gap-2">
          <button id="show-all" class="btn active cursor-pointer bg-button hover:bg-button-hover py-1 px-2 rounded-lg lg:text-lg text-sm">Show All</button>
          <button id="highest-bid" class="bg-button hover:bg-button-hover py-1 px-2 rounded-lg lg:text-lg text-sm">Highest Bids</button>
          <button id="listing-new" class="bg-button hover:bg-button-hover py-1 px-2 rounded-lg lg:text-lg text-sm">New Listings</button>
          <button id="listing-ended" class="bg-button hover:bg-button-hover py-1 px-2 rounded-lg lg:text-lg text-sm">Ended Listings</button>
        </div>
      </div>
    </div>
  `;

  setupFilterButtons();
}

/**
 * Set up filter button click events
 */
function setupFilterButtons() {
  // Tag filters
  document.querySelectorAll('#filter-tags .btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const selectedTag = btn.id;
      page = 1; // Reset to the first page
      currentTag = selectedTag;
      isActive = true; // Reset to active listings
      await fetchAndRenderAuctions(selectedTag, isActive, sortBy, page);
    });
  });

  // Show All
  document.getElementById('show-all')?.addEventListener('click', async () => {
    page = 1;
    currentTag = null;
    await fetchAndRenderAuctions(null, isActive, sortBy, page);
  });

  // Sorting buttons
  document
    .getElementById('highest-bid')
    ?.addEventListener('click', async () => {
      page = 1;
      sortBy = 'highestBid';
      await fetchAndRenderAuctions(currentTag, isActive, sortBy, page);
    });

  document
    .getElementById('listing-new')
    ?.addEventListener('click', async () => {
      page = 1;
      sortBy = 'created';
      await fetchAndRenderAuctions(currentTag, isActive, sortBy, page);
    });

  document
    .getElementById('listing-ended')
    ?.addEventListener('click', async () => {
      page = 1;
      isActive = false;
      await fetchAndRenderAuctions(currentTag, isActive, 'endsAt', page);
    });
}

// Initialize pagination
setupPaginationButtons();
fetchAndRenderAuctions();
