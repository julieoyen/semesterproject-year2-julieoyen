import { updatePaginationButtons } from './pagination';
import { renderAuctionCard } from '../components/card';
import { fetchAndRenderAuctions } from './filterTags';
import { API_AUCTION_LISTINGS } from './constants';

const limit = 12;
let searchQuery = '';

async function fetchSearchResults(query, page = 1, limit = 12) {
  try {
    const response = await fetch(
      `${API_AUCTION_LISTINGS}/search?q=${encodeURIComponent(query)}&limit=${limit}&page=${page}&_seller=true&_bids=true&_active=true`,
      { method: 'GET', headers: { 'Content-Type': 'application/json' } }
    );

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching search results:', error);
    return { data: [], meta: { pageCount: 0 } };
  }
}

async function handleSearchInput(event) {
  const query = event.target.value.trim();
  searchQuery = query;
  const page = 1;

  const filterContainer = document.getElementById('filter-container');

  if (query) {
    if (filterContainer) filterContainer.style.display = 'none';

    try {
      const results = await fetchSearchResults(query, page, limit);
      renderSearchResults(results.data);

      updatePaginationButtons(page, results.meta.pageCount, async (p) => {
        const updatedResults = await fetchSearchResults(searchQuery, p, limit);
        renderSearchResults(updatedResults.data);
      });
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  } else {
    if (filterContainer) {
      filterContainer.style.display = 'flex';
      filterContainer.classList.add(
        'flex',
        'flex-col',
        'items-center',
        'justify-center',
        'space-y-6'
      );
    }
    fetchAndRenderAuctions(1);
  }
}

function renderSearchResults(results) {
  const container = document.getElementById('auction-card-container');
  container.innerHTML = '';

  if (results.length > 0) {
    results.forEach((auction) => renderAuctionCard(auction, container));
  } else {
    container.innerHTML = '<p>No auctions found.</p>';
  }
}

export function initSearchBar() {
  const searchInput = document.getElementById('searchbar-field');

  if (!searchInput) {
    console.error('Search input field not found.');
    return;
  }

  searchInput.addEventListener('input', handleSearchInput);
}
