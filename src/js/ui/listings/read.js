import { timeSincePosted, timeUntilEnds } from '../../utilities/formatDate';
import { isLoggedIn, getMyName, getIDFromURL } from '../../utilities/getInfo';
import defaultImage from '/images/default-img.png';
import defaultAvatar from '/images/default-avatar.png';
import { showToast } from '../../utilities/toast';
import { deleteListing } from '../../api/listings/delete';
import { openModal, closeModal } from '../../components/modal';

export function renderSingleAuctionCard(info, container, handleBid) {
  const {
    title = 'Untitled Auction',
    description = 'No description available.',
    media = [{ url: '/images/default-img.png', alt: 'No image available' }],
    endsAt = null,
    seller = { name: 'Unknown Seller', avatar: defaultAvatar },
    bids = [],
    _count = { bids: 0 },
  } = info;

  const id = getIDFromURL();
  const loggedIn = isLoggedIn();
  const hasEnded = new Date(endsAt) <= new Date();
  const isOwner = loggedIn && getMyName() === seller?.name;

  const sortedBids = [...bids].sort((a, b) => b.amount - a.amount);
  const highestBid = sortedBids[0]?.amount || 0;

  const card = document.createElement('div');
  card.className =
    'border rounded-lg shadow-lg overflow-hidden max-w-lg mb-5 text-left bg-white flex flex-col min-w-[300px] lg:min-w-[500px] lg:min-h-[600px]';

  const limitedMedia = media.slice(0, 8);
  document.title = `${title}`;

  const imagesHtml = limitedMedia
    .map((image, index) => {
      return `
      <div class="slide absolute inset-0 transition-transform duration-500 ease-in-out ${index === 0 ? 'translate-x-0' : 'translate-x-full'}">
          <img src="${image.url || defaultImage}" 
               alt="${image.alt || 'Auction Image'}" 
               class="w-full h-full object-cover"  
               loading="lazy" 
               onerror="this.onerror=null; this.src='${defaultImage}';">
      </div>
    `;
    })
    .join('');

  const bidHistoryHtml = sortedBids.length
    ? sortedBids
        .map(
          (bid, index) => `
      <li class="flex items-center justify-between ${index === 0 ? 'font-bold text-xl text-button' : ''}">
        <a href="/profile/?user=${bid.bidder?.name || 'anonymous'}" class="flex items-center">
          <img src="${bid.bidder?.avatar?.url || defaultAvatar}" alt="${bid.bidder?.name || 'Anonymous'}" 
               class="w-6 h-6 rounded-full mr-2">
          <span>${bid.bidder?.name || 'Anonymous'}</span>
        </a>
        <span>$${bid.amount}</span>
      </li>`
        )
        .join('')
    : '<p class="text-sm text-gray-500">No bids placed yet.</p>';

  card.innerHTML = `
  <div class="rounded-lg w-full mx-auto bg-white flex flex-col h-full">
    <div class="mx-4 mt-4 flex items-center text-black">
      <a href="/profile/?user=${seller.name}" class="flex items-center mb-3">
        <img src="${seller.avatar.url || '/images/default-avatar.png'}"
             alt="${seller.name}" 
             class="w-10 h-10 rounded-full border">
        <div class="ml-3">
          <p class="text-sm font-medium">${seller.name || 'Unknown Seller'}</p>
        </div>
      </a>
    </div>
    <div class="relative overflow-hidden w-full h-80 flex-shrink-0">
      <div class="absolute top-2 right-2 z-10 text-sm px-3 py-1 rounded ${hasEnded ? 'bg-gray-300 text-black' : 'bg-button text-white'}">
        Bidding ${hasEnded ? 'ended' : 'ends'} 
        <span class="font-medium">${hasEnded ? timeSincePosted(endsAt) : timeUntilEnds(endsAt)}</span>
      </div>
      ${imagesHtml}
    </div>
    <div class="flex flex-col flex-grow p-6">
      <h1 class="lg:text-2xl text-xl text-black font-bold truncate">${title}</h1>
      <p class="lg:text-lg text-black mb-4">${description}</p>
      <p class="border-2 border-primary text-black p-4 rounded-lg text-lg">
        ${hasEnded ? 'Final bid' : 'Highest bid'}: 
        <span class="font-medium">$${highestBid}</span>
      </p>
      <div class="mt-6 border-t border-gray-200 pt-6">
        <h2 class="text-xl text-black font-semibold">Bid History</h2>
        <ul class="text-sm mt-3 space-y-2 text-black">${bidHistoryHtml}</ul>
      </div>
      <div class="mt-6 flex border-t border-gray-200 pt-6 justify-evenly">
        ${
          isOwner
            ? `
              <button class="edit-btn bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Edit
              </button>
              <button 
                class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 delete-btn" 
                auction-listings-id="${id}">
                Delete
              </button>
            `
            : loggedIn && !hasEnded
              ? `
                <button class="bg-button text-white px-5 py-3 rounded hover:button-hover" 
                  data-modal-trigger="bid-modal" data-auction-id="${id}">
                  Bid Now
                </button>
              `
              : `
                <button class="bg-button text-white px-4 py-2 rounded hover:bg-button-hover">
                  <a href="/auth/login/">Login to Bid</a>
                </button>
              `
        }
      </div>
    </div>
  </div>
  `;

  container.appendChild(card);

  const deleteButton = card.querySelector(`[auction-listings-id="${id}"]`);
  if (deleteButton && isOwner) {
    deleteButton.addEventListener('click', async () => {
      const confirmed = confirm('Are you sure you want to delete this post?');
      if (!confirmed) return;

      try {
        await deleteListing(id);
        showToast('Listing deleted successfully!');
        window.location.href = history.go(-1);
      } catch (error) {
        console.error(`Failed to delete listing: ${error.message}`);
        showToast('Failed to delete the listing. Please try again.', 'error');
      }
    });
  }
}
