import { renderAuctionCard } from '../../components/card';
import { fetchAuctionsByTag } from '../../utilities/filterTags';
import { initSearchBar } from '../../utilities/searchBar';

export async function fetchAuctions(
  queryParams = '',

  sortBy = 'endsAt',

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

    if (tagFilter) {
      auctionResults = await fetchAuctionsByTag(tagFilter, isActive);
    } else {
      auctionResults = await fetchAuctionsByTag(null, isActive);
    }

    const allAuctions = auctionResults;

    if (paginator) {
      paginator.setTotalItems(allAuctions.length);
    }

    let filteredAuctions = allAuctions;

    if (isActive !== null) {
      filteredAuctions = filteredAuctions.filter((auction) => {
        const auctionEndsAt = new Date(auction.endsAt);
        return isActive
          ? auctionEndsAt > new Date()
          : auctionEndsAt <= new Date();
      });
    }

    if (sortBy === 'endsAt') {
      filteredAuctions.sort((a, b) => new Date(a.endsAt) - new Date(b.endsAt));
    } else if (sortBy === 'created') {
      filteredAuctions.sort(
        (a, b) => new Date(b.created) - new Date(a.created)
      );
    } else if (sortBy === 'highestBid') {
      filteredAuctions.sort(
        (a, b) => (b.bids[0]?.amount || 0) - (a.bids[0]?.amount || 0)
      );
    }

    const limit = 12;
    const page = urlParams.get('page') ? parseInt(urlParams.get('page')) : 1;
    const startIndex = (page - 1) * limit;
    const paginatedAuctions = filteredAuctions.slice(
      startIndex,
      startIndex + limit
    );

    loading.remove();

    if (Array.isArray(paginatedAuctions) && paginatedAuctions.length > 0) {
      paginatedAuctions.forEach((auction) => {
        renderAuctionCard(auction, container);
      });
    } else {
      console.warn('No auctions found in API response');
      container.innerHTML =
        '<p class="text-center text-gray-500">No auctions available.</p>';
    }

    if (paginator) {
      paginator.setTotalItems(filteredAuctions.length);
    }

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
