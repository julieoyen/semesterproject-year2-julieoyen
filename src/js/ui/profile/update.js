import { API_AUCTION_LISTINGS, API_KEY } from '../../utilities/constants.js';
import { headers } from '../../utilities/headers.js';
import { getIDFromURL, getMyToken } from '../../utilities/getInfo';

const targetId = getIDFromURL();
const endpoint = `${API_AUCTION_LISTINGS}/${targetId}`;

export async function onUpdateListing(postId) {
  const token = getMyToken();
}
