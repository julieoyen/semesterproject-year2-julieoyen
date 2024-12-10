import { API_AUCTION_LISTINGS } from '../utilities/constants'; // Ensure this path is correct

// Fetch all listings
export async function getAllListings(page = 1) {
  const API_URL = `${API_AUCTION_LISTINGS}?_seller=true&_bids=true&_sort=endsAt&_sortOrder=desc&page=${page}&limit=12`;
  const response = await fetch(API_URL);
  const data = await response.json();
  return data;
}

// Fetch listings filtered by tags
export async function getAllFilterTags(page = 1, tag = null) {
  const allowedTags = ['jewelry', 'watches', 'art', 'vintage'];
  let API_URL = `${API_AUCTION_LISTINGS}?_seller=true&_bids=true&_sort=endsAt&_sortOrder=desc&page=${page}&limit=12`;

  if (tag && allowedTags.includes(tag)) {
    API_URL += `&tags=${encodeURIComponent(tag)}`;
  }

  const response = await fetch(API_URL);
  const tagsData = await response.json();
  return tagsData;
}

export function setupPagination(renderFunction, page) {
  const prevButton = document.querySelector('#prev-button');
  const nextButton = document.querySelector('#next-button');

  if (prevButton && nextButton) {
    prevButton.addEventListener('click', async () => {
      if (page > 1) {
        page--;
        await renderFunction(page);
      }
    });

    nextButton.addEventListener('click', async () => {
      page++;
      await renderFunction(page);
    });
  }
}
