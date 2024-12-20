/*
 * Handles fetching and rendering auction listings based on filters and sorting options.
 * Includes filtering by tags, active/inactive status, and sorting by bids or other parameters.
 */

import { fetchListings } from '../api/listings/read';
import { updatePaginationButtons } from './pagination';
import { renderAuctionCard } from '../components/card';

let currentTag = null;
let isActive = true;
let sort = 'endsAt';
let sortOrder = 'desc';
let currentPage = 1;
const limit = 12;
let _count = null;

export async function fetchAndRenderAuctions(page = 1) {
  try {
    // Fetch data from the API
    const auctions = await fetchListings(
      limit,
      page,
      sort,
      sortOrder,
      isActive,
      currentTag,
      _count
    );

    const container = document.getElementById('auction-card-container');
    container.innerHTML = '';

    // Client-side sorting for highest bid amount
    if (sort === 'highestBid') {
      auctions.data.sort((a, b) => {
        const maxBidA = Math.max(...(a.bids.map((bid) => bid.amount) || [0]));
        const maxBidB = Math.max(...(b.bids.map((bid) => bid.amount) || [0]));
        return sortOrder === 'desc' ? maxBidB - maxBidA : maxBidA - maxBidB;
      });
    }

    // Render the auction cards
    if (auctions.data.length > 0) {
      auctions.data.forEach((auction) => renderAuctionCard(auction, container));
    } else {
      container.innerHTML = '<p>No auctions available for this filter.</p>';
    }

    updatePaginationButtons(
      page,
      auctions.meta.pageCount || 0,
      fetchAndRenderAuctions
    );
  } catch (error) {
    console.error('Error fetching auctions:', error);
    document.getElementById('auction-card-container').innerHTML =
      '<p>Error loading auctions. Please try again later.</p>';
  }
}

export function createFilterComponent(containerId) {
  const container = document.getElementById(containerId);

  if (!container) {
    return;
  }

  container.innerHTML = `<div id="container" class="flex flex-col items-center justify-center w-full mb-3 space-y-6">
    <div class="flex flex-col items-center font-bebas text-4xl justify-center w-full"><h1>Our most popular tags</h1></div>
    <div class="grid justify-center   sm:max-w-full max-w-[300px] p-6 rounded-lg">
      <div class="flex flex-row font-roboto font-extrabold gap-2" id="filter-tags">
        <button id="art" class="btn cursor-pointer max-w-40 max-h-40 min-w-20 min-h-20 rounded-lg lg:text-xl hover:text-primary">ART<img src="/images/art.png" alt="art-icon"></button>
        <button id="watches" class="btn cursor-pointer max-w-40 max-h-40 min-w-20 min-h-20 rounded-lg lg:text-xl hover:text-primary">WATCHES<img src="/images/watch.png" alt="watches-icon"></button>
        <button id="vintage" class="btn cursor-pointer max-w-40 max-h-40 min-w-20 min-h-20 rounded-lg lg:text-xl hover:text-primary">VINTAGE<img src="/images/vintage.png" alt="vintage-icon"></button>
        <button id="jewelry" class="btn cursor-pointer max-w-40 max-h-40 min-w-20 min-h-20 rounded-lg lg:text-xl hover:text-primary">JEWELRY<img src="/images/jewelry.png" alt="jewelry"></button>
      </div>
    </div>
    <div class="grid justify-center pb-2 ">
      <div class="mt-4 flex justify-center sm:max-w-full  max-w-[300px] text-white gap-2">
        <button id="show-all" class="btn active cursor-pointer bg-button hover:bg-button-hover py-1 px-2 rounded-lg lg:text-lg text-sm">Show All</button>
        <button id="listing-new" class="bg-button hover:bg-button-hover py-1 px-2 rounded-lg lg:text-lg text-sm">New Listings</button>
         <button id="highest-amount-bid" class="bg-button hover:bg-button-hover py-1 px-2 rounded-lg lg:text-lg text-sm">Ending soon</button>
         <button id="listing-ended" class="bg-button hover:bg-button-hover py-1 px-2 rounded-lg lg:text-lg text-sm">Ended Listings</button>
      </div>
    </div>
  </div>`;

  setupFilterButtons();
}

function setupFilterButtons() {
  document.querySelectorAll('#filter-tags .btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      currentTag = btn.id;
      currentPage = 1;
      isActive = true;
      sort = 'endsAt';
      await fetchAndRenderAuctions(currentPage);
    });
  });

  document.getElementById('show-all').addEventListener('click', async () => {
    currentTag = null;
    isActive = true;
    sort = 'title';
    sortOrder = 'asc';
    currentPage = 1;
    await fetchAndRenderAuctions(currentPage);
  });

  document
    .getElementById('highest-amount-bid')
    .addEventListener('click', async () => {
      currentTag = null;
      isActive = true;
      sort = 'endsAt';
      sortOrder = 'asc';
      currentPage = 1;
      await fetchAndRenderAuctions(currentPage);
    });

  document.getElementById('listing-new').addEventListener('click', async () => {
    currentTag = null;
    isActive = true;
    sort = 'created';
    currentPage = 1;
    await fetchAndRenderAuctions(currentPage);
  });

  document
    .getElementById('listing-ended')
    .addEventListener('click', async () => {
      currentTag = null;
      isActive = false;
      sortOrder = 'asc';
      sort = 'endsAt';
      currentPage = 1;
      await fetchAndRenderAuctions(currentPage);
    });
}
