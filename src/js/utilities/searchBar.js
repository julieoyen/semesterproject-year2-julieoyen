export function initSearchBar(onSearch, allAuctions) {
  const searchInput = document.getElementById('searchbar-field');

  if (searchInput) {
    searchInput.addEventListener('input', (event) => {
      const query = event.target.value.toLowerCase().trim();

      if (!query) {
        const sortedAuctions = [...allAuctions].sort((a, b) => {
          const aTime = new Date(a.endsAt).getTime();
          const bTime = new Date(b.endsAt).getTime();
          return aTime - bTime;
        });
        onSearch(sortedAuctions);
        return;
      }

      const searchedAuctions = allAuctions.filter((auction) => {
        const titleMatch =
          typeof auction.title === 'string' &&
          auction.title.toLowerCase().includes(query);

        const sellerNameMatch =
          auction.seller &&
          typeof auction.seller.name === 'string' &&
          auction.seller.name.toLowerCase().includes(query);

        const descriptionMatch =
          typeof auction.description === 'string' &&
          auction.description.toLowerCase().includes(query);

        return titleMatch || sellerNameMatch || descriptionMatch;
      });

      onSearch(searchedAuctions);
    });
  }
}
