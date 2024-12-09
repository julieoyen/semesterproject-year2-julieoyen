export function initSearchBar(onSearch, allAuctions) {
  const searchInput = document.getElementById('searchbar-field');

  if (searchInput) {
    searchInput.addEventListener('input', (event) => {
      const query = event.target.value.toLowerCase();

      const searchedAuctions = allAuctions.filter((auction) => {
        return (
          (typeof auction.title === 'string' &&
            auction.title.toLowerCase().includes(query)) ||
          (typeof auction.seller === 'string' &&
            auction.seller.toLowerCase().includes(query)) ||
          (typeof auction.description === 'string' &&
            auction.description.toLowerCase().includes(query))
        );
      });
      onSearch(searchedAuctions);
    });
  }
}
