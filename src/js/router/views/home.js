import { initMenu } from '../../utilities/hamburgerMenu';
import { renderHeader } from '../../components/header';
import { fetchAuctions } from '../../api/listing/read';
import { createFilterComponent } from '../../utilities/filterTags';

renderHeader();
initMenu();

await fetchAuctions('', 'created', 'desc');

createFilterComponent(
  'filter-container',
  (selectedTag, isActive, sortBy = 'endsAt') => {
    const queryParams = selectedTag
      ? `_tag=${selectedTag}&_active=${isActive}`
      : `_active=${isActive}`;
    fetchAuctions(queryParams, sortBy);
  }
);

document.addEventListener('listingDeleted', () => {
  fetchAuctions();
});
