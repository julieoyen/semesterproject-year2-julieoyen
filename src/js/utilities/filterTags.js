import { fetchAuctions } from '../router/views/listing';
import { API_AUCTION_LISTINGS } from '../utilities/constants';

const tags = ['jewelry', 'watches', 'art', 'vintage'];

export async function fetchAuctionsByTag(tag, isActive) {
  const API_URL = `${API_AUCTION_LISTINGS}?_tag=${encodeURIComponent(tag)}&_active=${isActive}&_seller=true&_bids=true`;

  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch: ${response.status} ${response.statusText}`
    );
  }

  const result = await response.json();
  return result.data || [];
}

export function createFilterComponent(containerId, onFiltersApplied) {
  const container = document.getElementById(containerId);

  if (!container) {
    console.error(`Container with ID "${containerId}" not found`);
    return;
  }

  container.innerHTML = `


        <div class="container flex justify-center p-6">
            <div class="bg-white grid justify-center  p-6 rounded-lg shadow-lg">
                <div class="flex flex-wrap gap-2" id="filter-tags">
                
                    <button id="show-all" class="btn active bg-red-200 hover:bg-blue-300 py-1 px-2 rounded-lg text-sm">Show All</button>
                    <button id="art" class="btn bg-orange-200 hover:bg-blue-300 py-1 px-2 rounded-lg text-sm">Art</button>
                    <button id="watches" class="btn bg-yellow-200 hover:bg-green-300 py-1 px-2 rounded-lg text-sm">Watches</button>
                    <button id="vintage" class="btn bg-green-200 hover:bg-yellow-300 py-1 px-2 rounded-lg text-sm">Vintage</button>
                    <button id="jewelry" class="btn bg-blue-200 hover:bg-red-300 py-1 px-2 rounded-lg text-sm">Jewelry</button>
                </div>
                <div class="mt-4 flex justify-between">
                    <button id="listing-active" class="bg-green-300 hover:bg-green-400 py-1 px-2 rounded-lg text-sm">Active Listings</button>
                    <button id="listing-ended" class="bg-red-300 hover:bg-red-400 py-1 px-2 rounded-lg text-sm">Ended</button>
                </div>
            </div>
        </div>
    `;

  const filterButtons = document.querySelectorAll('#filter-tags button');
  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const selectedTag = button.id === 'show-all' ? null : button.id;
      onFiltersApplied(selectedTag, true);
    });
  });

  document.getElementById('listing-active').addEventListener('click', () => {
    onFiltersApplied(null, true);
  });

  document.getElementById('listing-ended').addEventListener('click', () => {
    onFiltersApplied(null, false);
  });
}
