import { renderAuctionCard } from '../../components/card';
import {
  getAllListings,
  getAllFilterTags,
  getLimit,
} from '../../utilities/pagination';
import { initSearchBar } from '../../utilities/searchBar';
import { fetchAndRenderAuctions } from '../../utilities/filterTags';

export async function fetchAuctions(
  queryParams = '',
  sortBy = 'endsAt',
  sortOrder = 'desc',
  paginator = null
) {
  const container = document.getElementById('auction-card-container');

  if (!container) {
    console.error('Container with ID "auction-card-container" not found');
    return;
  }

  container.innerHTML = '';

  const loading = document.createElement('p');
  loading.id = 'loading';
  loading.className = 'text-center text-gray-500';
  loading.textContent = 'Loading auctions...';
  container.appendChild(loading);

  try {
    const urlParams = new URLSearchParams(queryParams);
    const isActive = urlParams.get('_active') === 'true';
    const tagFilter = urlParams.get('_tag');
    let auctionResults;

    // Fetch auctions based on filters
    if (tagFilter) {
      auctionResults = await getAllFilterTags(
        urlParams.get('page'),
        tagFilter,
        sortBy,
        sortOrder
      );
    } else {
      auctionResults = await getAllListings(
        urlParams.get('page'),
        sortBy,
        sortOrder
      );
    }

    const allAuctions = auctionResults.data;

    if (paginator) {
      paginator.setTotalItems(allAuctions.length);
    }

    const limit = getLimit(); // Correctly fetching the limit value
    const page = Number(urlParams.get('page')) || 1;
    const startIndex = (page - 1) * limit;
    const paginatedAuctions = allAuctions.slice(startIndex, startIndex + limit);

    loading.remove();

    if (Array.isArray(paginatedAuctions) && paginatedAuctions.length > 0) {
      paginatedAuctions.forEach((auction) => {
        renderAuctionCard(auction, container);
      });
    } else {
      container.innerHTML =
        '<p class="text-center text-gray-500">No auctions available.</p>';
    }

    if (paginator) {
      paginator.setTotalItems(allAuctions.length);
    }

    // Initialize search bar functionality
    initSearchBar((searchedAuctions) => {
      container.innerHTML = '';

      if (searchedAuctions.length > 0) {
        searchedAuctions.forEach((auction) => {
          renderAuctionCard(auction, container);
        });
      } else {
        container.innerHTML =
          '<p class="text-center text-gray-500">No auctions found matching your search.</p>';
      }
    }, allAuctions);
  } catch (error) {
    console.error('Error fetching auctions:', error);
    loading.remove();
    container.innerHTML =
      '<p class="text-center text-red-500">Error loading auctions. Please try again later.</p>';
  }
}
