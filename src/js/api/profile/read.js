import { API_AUCTION_PROFILES } from '../../utilities/constants';
import { loggedInHeaders } from '../../utilities/headers';

let myHeaders;

async function getHeaders() {
  if (!myHeaders) {
    myHeaders = await loggedInHeaders();
  }
  return myHeaders;
}

async function fetchData(url) {
  const response = await fetch(url, {
    method: 'GET',
    headers: await getHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.statusText}`);
  }

  return response.json();
}

export async function fetchAllProfileData(name) {
  if (typeof name !== 'string') {
    console.error('Invalid name:', name);
    throw new Error(`Invalid name: ${JSON.stringify(name)}`);
  }

  try {
    const profileData = await fetchData(
      `${API_AUCTION_PROFILES}/${name}?_listings=true&_wins=true&_bids=true&_seller=true`
    );
    const listingsData = await fetchData(
      `${API_AUCTION_PROFILES}/${name}/listings?_bids=true&_seller=true&bidder=true`
    );
    const winsData = await fetchData(
      `${API_AUCTION_PROFILES}/${name}/wins?_seller=true&_count=true&_bids=true`
    );
    const bidsData = await fetchData(
      `${API_AUCTION_PROFILES}/${name}/bids?_listings=true&_seller=true&_bids=true&bidder=true`
    );

    const activeBids = bidsData.data
      .filter((bid) => {
        const listing = bid.listing || {};
        return listing.endsAt && new Date(listing.endsAt) > new Date();
      })
      .map((bid) => {
        const listing = bid.listing || {};
        const media = listing.media || [
          { url: '/images/default-img.png', alt: 'No Image Available' },
        ];
        return {
          ...bid,
          listing: {
            ...listing,
            media,
          },
        };
      });

    return {
      profile: profileData.data,
      listings: listingsData.data,
      wins: winsData.data,
      bids: activeBids, // Only active bids
    };
  } catch (error) {
    console.error('Error fetching profile data:', error.message);
    return null;
  }
}
