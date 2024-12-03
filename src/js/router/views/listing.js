import { renderAuctionCard } from '../../components/card';
import { fetchAuctionsByTag } from '../../utilities/filterTags';

const tags = ['jewelry', 'watches', 'art', 'vintage'];

export async function fetchAuctions(queryParams = '') {
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

    filteredAuctions.sort((a, b) => new Date(b.created) - new Date(a.created));

    loading.remove();

    if (Array.isArray(filteredAuctions) && filteredAuctions.length > 0) {
      filteredAuctions.forEach((auction) => {
        renderAuctionCard(auction, container);
      });
    } else {
      console.warn('No auctions found in API response');
      container.innerHTML =
        '<p class="text-center text-gray-500">No auctions available.</p>';
    }
  } catch (error) {
    console.error('Error fetching auctions:', error);
    container.innerHTML = `<p class="text-center text-red-500">Failed to load auctions. Please try again later.</p>`;
  }
}
