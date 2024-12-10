import { renderAuctionCard } from '../../components/card';
import { fetchAuctionsByTag } from '../../utilities/filterTags';
import { initSearchBar } from '../../utilities/searchBar';

const tags = ['jewelry', 'watches', 'art', 'vintage'];

export async function fetchAuctions(queryParams = '', sortBy = 'endsAt') {
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
    const auctionPromises = tags.map((tag) => {
      const urlParams = new URLSearchParams(queryParams);
      const isActive = urlParams.get('_active') === 'true';
      return fetchAuctionsByTag(tag, isActive);
    });

    const auctionResults = await Promise.all(auctionPromises);
    const allAuctions = [].concat(...auctionResults);

    let filteredAuctions = allAuctions;
    const urlParams = new URLSearchParams(queryParams);
    const tagFilter = urlParams.get('_tag');
    const activeFilter = urlParams.get('_active');

    if (tagFilter) {
      filteredAuctions = filteredAuctions.filter(
        (auction) => auction.tags && auction.tags.includes(tagFilter)
      );
    }

    if (activeFilter !== null) {
      const isActive = activeFilter === 'true';
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
    } else if (activeFilter === 'false') {
      filteredAuctions.sort((a, b) => new Date(b.endsAt) - new Date(a.endsAt));
    }

    loading.remove();

    // Render the initial filtered auctions
    if (Array.isArray(filteredAuctions) && filteredAuctions.length > 0) {
      filteredAuctions.forEach((auction) => {
        renderAuctionCard(auction, container);
      });
    } else {
      console.warn('No auctions found in API response');
      container.innerHTML =
        '<p class="text-center text-gray-500">No auctions available.</p>';
    }

    // Initialize the search bar with the allAuctions array
    initSearchBar((searchedAuctions) => {
      // Clear previous results and render searched auctions
      container.innerHTML = '';

      if (searchedAuctions.length > 0) {
        searchedAuctions.forEach((auction) => {
          renderAuctionCard(auction, container);
        });
      } else {
        container.innerHTML =
          '<p class="text-center text-gray-500">No auctions found matching your search.</p>';
      }
    }, allAuctions); // Pass allAuctions to the search bar
  } catch (error) {
    console.error('Error fetching auctions:', error);
    loading.remove();
    container.innerHTML =
      '<p class="text-center text-red-500">Error loading auctions. Please try again later.</p>';
  }
}
