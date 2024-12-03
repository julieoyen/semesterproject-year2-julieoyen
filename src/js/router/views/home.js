import { initMenu } from '../../utilities/hamburgerMenu';
import { renderHeader } from '../../components/header';
import { fetchAuctions } from './listing';
import { createFilterComponent } from '../../utilities/filterTags';

renderHeader();
initMenu();

fetchAuctions();

// Set up filters
createFilterComponent('filter-container', (selectedTag, isActive) => {
  const queryParams = selectedTag
    ? `_tag=${selectedTag}&_active=${isActive}`
    : `_active=${isActive}`;
  fetchAuctions(queryParams); // Fetch listings with filters
});

// Listen for deletion updates
document.addEventListener('listingDeleted', () => {
  fetchAuctions(); // Re-fetch listings after deletion
});
