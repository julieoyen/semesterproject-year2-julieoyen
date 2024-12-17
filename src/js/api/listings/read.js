import { renderAuctionCard } from '../../components/card';
import { API_AUCTION_LISTINGS } from '../../utilities/constants';
import { headers } from '../../utilities/headers';

const urlApi = API_AUCTION_LISTINGS;
const myHeaders = headers();
export async function fetchListings(
  limit,
  page,
  sort,
  sortOrder,
  isActive,
  tag,
  count,
  _seller,
  _bids
) {
  const params = new URLSearchParams({
    _bids: true,
    _active: isActive ? true : false,
    _tag: tag || '',
    limit: limit.toString(),
    page: page.toString(),
    sort: sort || '',
    sortOrder: sortOrder || '',
    _seller: true,
  });

  if (count !== null) {
    params.append('_count', count.toString());
  }

  try {
    const response = await fetch(
      `https://v2.api.noroff.dev/auction/listings/?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch listings: ${response.status} ${response.statusText}`
      );
    }

    const listings = await response.json();
    console.log(listings);
    return listings;
  } catch (error) {
    console.error('Error fetching listings:', error);
    return [];
  }
}

export async function fetchListing(id) {
  const param = `?_bids=true&_seller=true`;
  const url = `${urlApi}/${id}/${param}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        ...myHeaders,
        'Content-Type': 'application/json',
        redirect: 'follow',
      },
    });
    if (!response.ok) {
      throw new Error(
        `Failed to fetch: ${response.status} ${response.statusText}`
      );
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.error('Error fetching listing:', error);
    return null;
  }
}
