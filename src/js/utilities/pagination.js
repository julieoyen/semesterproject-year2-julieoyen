import { API_AUCTION_LISTINGS } from '../utilities/constants';

/**
 * Fetch all listings
 * @param {number} page - Current page (default: 1)
 * @returns {Promise<object>} - API response containing listings
 */

const page = 1;
export async function getAllListings() {
  const API_URL = `${API_AUCTION_LISTINGS}?_seller=true&_bids=true&_sort=endsAt&_sortOrder=desc&page=${page}&limit=12&_active=true`;
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch: ${response.status} ${response.statusText}`
    );
  }
  const data = await response.json();
  return data;
}

/**
 * Fetch listings filtered by tags
 * @param {number} page - Current page (default: 1)
 * @param {string|null} tag - Filter by tag (default: null)
 * @returns {Promise<object>} - API response containing filtered listings
 */
export async function getAllFilterTags(page = 1, tag = null) {
  if (!tag) {
    throw new Error('Tag parameter is required for filtering.');
  }

  const API_URL = `${API_AUCTION_LISTINGS}?_seller=true&_bids=true&_sort=endsAt&_sortOrder=desc&page=${page}&limit=12&_active=true&_tag=${tag}`;

  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch: ${response.status} ${response.statusText}`
    );
  }
  const tagsData = await response.json();
  return tagsData;
}

let currentPage = 1; // Track the current page
const limit = 12; // Number of auctions to display per page

/**
 * Get the current page
 * @returns {number} - Current page
 */
export function getCurrentPage() {
  return currentPage;
}

/**
 * Set the current page
 * @param {number} page - New current page
 */
export function setCurrentPage(page) {
  currentPage = page;
}

/**
 * Get the limit of items per page
 * @returns {number} - Limit of items per page
 */
export function getLimit() {
  return limit;
}

/**
 * Update pagination button states
 * @param {number} page - Current page
 * @param {number} itemCount - Number of items returned
 */
export function updatePaginationButtons(page, itemCount) {
  const prevButton = document.querySelector('#prev-button');
  const nextButton = document.querySelector('#next-button');

  if (prevButton) prevButton.disabled = page <= 1;
  if (nextButton) nextButton.disabled = itemCount < limit;
}

/**
 * Set up pagination button click events
 * @param {function} fetchAndRenderAuctions - Function to fetch and render auctions
 */
export function setupPaginationButtons(fetchAndRenderAuctions) {
  const prevButton = document.querySelector('#prev-button');
  const nextButton = document.querySelector('#next-button');

  if (prevButton) {
    prevButton.addEventListener('click', async () => {
      if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
        await fetchAndRenderAuctions();
      }
    });
  }

  if (nextButton) {
    nextButton.addEventListener('click', async () => {
      setCurrentPage(currentPage + 1);
      await fetchAndRenderAuctions();
    });
  }
}
