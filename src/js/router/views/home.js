import { initMenu } from '../../utilities/hamburgerMenu';
import { renderHeader } from '../../components/header';
import { createFilterComponent } from '../../utilities/filterTags';
import { initSearchBar } from '../../utilities/searchBar';
import { fetchAndRenderAuctions } from '../../utilities/filterTags';

// Initialize components
renderHeader(); // Render the header
initMenu(); // Initialize the menu
createFilterComponent('filter-container'); // Initialize filters (ensure container exists)
initSearchBar(); // Initialize search bar

// Load the default auctions
fetchAndRenderAuctions(1); // Fetch and render the first page

// Listen for listing deletion events
document.addEventListener('listingDeleted', () => {
  fetchAndRenderAuctions(1); // Reload auctions after a listing is deleted
});
