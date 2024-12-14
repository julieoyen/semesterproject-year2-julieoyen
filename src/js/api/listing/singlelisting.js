/**
 * Fetch a single listing by its ID
 * @param {string} id - The ID of the listing to fetch
 * @param {Object} options - Query options like _seller and _bids
 * @returns {Object|null} - Listing data or null on failure
 */
export async function fetchSingleListing(id, options = {}) {
  const params = new URLSearchParams({ ...options }).toString();
  const endpoint = `/auction/listings/${id}?${params}`;

  try {
    const response = await fetch(endpoint, { method: 'GET' });
    if (!response.ok) {
      throw new Error(`Failed to fetch listing: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data || null;
  } catch (error) {
    console.error('Error fetching single listing:', error.message);
    return null;
  }
}
