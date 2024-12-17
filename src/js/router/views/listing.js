//router/views/listing.js
import { fetchListing } from '../../api/listings/read';
import { renderSingleAuctionCard } from '../../ui/listings/read';
import { renderHeader } from '../../components/header';
import { handleBid } from '../../ui/listings/bid';

renderHeader();

async function loadListingPage() {
  const listingsContainer = document.getElementById('listings-container');
  const listingId = new URLSearchParams(window.location.search).get('id');

  if (!listingId || typeof listingId !== 'string') {
    listingsContainer.innerHTML =
      '<p class="text-center text-red-500">Listing not found.</p>';
    return;
  }

  try {
    const listingData = await fetchListing(listingId);

    if (!listingData || !listingData.data) {
      listingsContainer.innerHTML =
        '<p class="text-center text-red-500">Error loading listing.</p>';
      return;
    }

    // Pass the `handleBid` function as a parameter to `renderSingleAuctionCard`
    renderSingleAuctionCard(listingData.data, listingsContainer, handleBid);
  } catch (error) {
    console.error('Error loading listing:', error);
    listingsContainer.innerHTML =
      '<p class="text-center text-red-500">Failed to load listing. Try again later.</p>';
  }
}

loadListingPage();
