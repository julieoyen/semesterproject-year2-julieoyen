import { initMenu } from '../../utilities/hamburgerMenu';
import { renderHeader } from '../../components/header';
import { fetchAuctions } from './listing';
import { createFilterComponent } from '../../utilities/filterTags';

renderHeader();
initMenu();

fetchAuctions('_active=true', 'endsAt');

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
