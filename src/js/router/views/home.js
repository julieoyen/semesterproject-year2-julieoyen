import { renderHeader } from '../../components/header';
import { createFilterComponent } from '../../utilities/filterTags';
import { initSearchBar } from '../../utilities/searchBar';
import { fetchAndRenderAuctions } from '../../utilities/filterTags';

renderHeader();
createFilterComponent('filter-container');
initSearchBar();

fetchAndRenderAuctions(1);

document.addEventListener('listingDeleted', () => {
  fetchAndRenderAuctions(1);
});
