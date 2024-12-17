//components/singleard.js:

import { timeSincePosted, timeUntilEnds } from '../../utilities/formatDate';
import { isLoggedIn, getMyName, getIDFromURL } from '../../utilities/getInfo';
import { openModal, closeModal } from '../../components/modal';
import defaultImage from '/images/default-img.png';
import defaultAvatar from '/images/default-avatar.png';

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
    'border rounded-lg shadow-lg overflow-hidden max-w-lg mb-5 text-left bg-white flex flex-col min-w-[500px] min-h-[600px]';

  const limitedMedia = media.slice(0, 8);

  const imagesHtml = limitedMedia
    .map((image, index) => {
      return `
      <div class="slide absolute inset-0 transition-transform duration-500 ease-in-out ${index === 0 ? 'translate-x-0' : 'translate-x-full'}">
          <img src="${image.url || defaultImage}" 
               alt="${image.alt || 'Auction Image'}" 
               class="w-full h-full object-cover"  
               loading="lazy" 
               onerror="this.onerror=null; this.src="defaultImage";">
      </div>
    `;
    })
    .join('');

  const bidHistoryHtml = sortedBids.length
    ? sortedBids
        .map(
          (bid, index) => `
      <li class="flex items-center justify-between ${index === 0 ? 'font-bold text-xl text-blue-500' : ''}">
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
    ${
      loggedIn
        ? `<div class="mx-4 mt-4 flex items-center text-black">
            <a href="/profile/?user=${seller.name}" class="flex items-center mb-3">
              <img src="${seller.avatar.url || '/images/default-avatar.png'}"
                   alt="${seller.name}" 
                   class="w-10 h-10 rounded-full border">
              <div class="ml-3">
                <p class="text-sm font-medium">${seller.name || 'Unknown Seller'}</p>
              </div>
            </a>
          </div>`
        : `<div class="mx-4 mt-4 flex items-center text-black">
            <img src="${seller.avatar.url || '/images/default-avatar.png'}"
                 alt="${seller.name}" 
                 class="w-10 h-10 rounded-full mb-3 border">
            <div class="ml-3">
              <p class="text-md mb-3 font-semibold">${seller.name || 'Unknown Seller'}</p>
            </div>
          </div>`
    }
    <div class="relative overflow-hidden w-full h-80 flex-shrink-0">
      <div class="absolute top-2 right-2 z-10 text-sm px-3 py-1 rounded ${hasEnded ? 'bg-gray-300 text-black' : 'bg-button text-white'}">
        Bidding ${hasEnded ? 'ended' : 'ends'} 
        <span class="font-medium">${hasEnded ? timeSincePosted(endsAt) : timeUntilEnds(endsAt)}</span>
      </div>
      ${imagesHtml}
      ${
        limitedMedia.length > 1
          ? `
            <button class="absolute rounded-md bottom-4 right-4 bg-white border-2 border-button hover:bg-button hover:text-white w-8 h-8 flex items-center justify-center text-black" data-action="next">
              &#x276F;
            </button>
            <button class="absolute rounded-md bottom-4 left-4 bg-white border-2 border-button hover:bg-button hover:text-white w-8 h-8 flex items-center justify-center text-black" data-action="prev">
              &#x276E;
            </button>
          `
          : ''
      }
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
                <button class="bg-blue-500 text-white px-5 py-3 rounded hover:bg-blue-600" 
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

  const slides = card.querySelectorAll('.slide');
  let currentIndex = 0;

  const updateSlides = () => {
    slides.forEach((slide, index) => {
      slide.classList.remove(
        'translate-x-0',
        'translate-x-full',
        '-translate-x-full'
      );
      slide.classList.add(
        index === currentIndex
          ? 'translate-x-0'
          : index > currentIndex
            ? 'translate-x-full'
            : '-translate-x-full'
      );
    });
  };

  const nextBtn = card.querySelector('[data-action="next"]');
  const prevBtn = card.querySelector('[data-action="prev"]');

  nextBtn?.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % slides.length;
    updateSlides();
  });

  prevBtn?.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateSlides();
  });

  updateSlides();

  const bidNowButton = card.querySelector('[data-modal-trigger="bid-modal"]');
  if (bidNowButton) {
    bidNowButton.addEventListener('click', () => {
      const modal = document.getElementById('bid-modal');
      if (modal) {
        modal.dataset.auctionId = id;
        openModal(modal);

        const bidInput = modal.querySelector('#bid-amount');
        const feedback = modal.querySelector('#bid-feedback');
        const submitButton = modal.querySelector('#submit-bid-btn');

        if (!submitButton || !bidInput) return;

        submitButton.addEventListener('click', () => {
          const bidAmount = parseFloat(bidInput.value);
          handleBid({ id, bidAmount, highestBid, feedback, modal });
        });

        const closeModalButton = modal.querySelector('#close-modal-btn');
        closeModalButton?.addEventListener('click', () => {
          closeModal(modal);
        });

        modal.addEventListener('click', (event) => {
          if (event.target === modal) closeModal(modal);
        });
      }
    });
  }

  if (container) {
    container.innerHTML = '';
    container.appendChild(card);
  }
}
