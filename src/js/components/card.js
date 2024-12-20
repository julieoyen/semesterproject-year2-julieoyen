/**
 * @module AuctionCardRenderer
 *
 * This module renders an auction card on a webpage with detailed auction information.
 * It supports accessibility features, dynamic content updates, and interactivity for logged-in users.
 *
 * @requires ../utilities/formatDate - Utilities for formatting date-related information.
 * @requires ../utilities/getInfo - Utilities for retrieving user authentication and profile information.
 * @requires ../api/listings/delete - API function to delete an auction listing.
 * @requires /images/default-img.png - Default image used as a fallback for auction media.
 *
 * @function renderAuctionCard
 * @param {Object} info - The auction information object.
 * @param {string} info.title - The title of the auction.
 * @param {string} info.id - The unique ID of the auction.
 * @param {string} info.description - The description of the auction.
 * @param {Array<string>} info.tags - The tags associated with the auction.
 * @param {Array<Object>} info.media - Media objects containing `url` and optional `alt` properties.
 * @param {string} info.created - ISO string representing the creation time of the auction.
 * @param {string} info.endsAt - ISO string representing the auction's end time.
 * @param {Object} info.seller - The seller's information, including `name` and `avatar` properties.
 * @param {Array<Object>} info.bids - The list of bids on the auction, each containing `amount`.
 * @param {HTMLElement} container - The DOM element where the auction card will be appended.
 *
 * @returns {void}
 */

import { timeSincePosted, timeUntilEnds } from '../utilities/formatDate';
import { isLoggedIn, getMyToken, getMyName } from '../utilities/getInfo';
import { deleteListing } from '../api/listings/delete';
import defaultImage from '/images/default-img.png';
import { openModal, closeModal } from './modal';
import { showToast } from '../utilities/toast';

export function renderAuctionCard(info, container) {
  const {
    title,
    id,
    description,
    tags,
    media,
    created,
    endsAt,
    seller,
    bids = [],
    _count,
  } = info;

  const highestBid = bids.length
    ? Math.max(...bids.map((bid) => bid.amount))
    : 0;

  const bidCount = _count?.bids || bids.length;

  function isOwner() {
    return isLoggedIn() && getMyName() === seller?.name;
  }

  const loggedIn = isLoggedIn();
  const hasEnded = new Date(endsAt) <= new Date();

  const card = document.createElement('div');
  card.className =
    'border rounded-lg shadow-lg justify-between justify-items-center overflow-hidden max-w-xs mb-5 text-left bg-white flex flex-col min-w-[350px] min-h-[400px]';

  const limitedMedia = media.slice(0, 8);

  const imagesHtml = limitedMedia.length
    ? limitedMedia
        .map((image, index) => {
          return `
          <div class="slide absolute inset-0 transition-transform duration-500 ease-in-out ${
            index === 0 ? 'translate-x-0' : 'translate-x-full'
          }">
            <a href="/listings/?id=${id}">
              <img src="${image.url || defaultImage}" 
                   alt="${image.alt || 'Auction Image'}" 
                   class="w-full h-full object-cover"  
                   loading="lazy" 
                   onerror="this.onerror=null; this.src='${defaultImage}';">
            </a>
          </div>
        `;
        })
        .join('')
    : (() => {
        const fallbackContainer = document.createElement('div');
        fallbackContainer.className = 'slide absolute inset-0';
        fallbackContainer.innerHTML = `
        <a href="/listings/?id=${id}">
          <img src="${defaultImage}" 
               alt="Default Image" 
               class="w-full h-full object-cover" 
               loading="lazy">
        </a>`;
        return fallbackContainer.outerHTML;
      })();

  const sellerName = seller?.name || 'Unknown Seller';
  const sellerAvatar = seller?.avatar?.url || '/images/default-avatar.png';

  card.innerHTML = `
    <div class="rounded-lg w-full mx-auto bg-white flex flex-col h-full">
      <!-- Seller Information -->
      <div class="mx-4 mt-4 mb-3 flex items-center text-black">
      ${
        loggedIn
          ? `<a href="/profile/?user=${sellerName}" class="flex items-center"> 
      <img src="${sellerAvatar}" 
           alt="${sellerName}" 
           class="w-10 h-10 object-cover rounded-full border">
      <div class="ml-3">
        <p class="text-md font-medium">${sellerName}</p>
      </div>`
          : `
    <img src="${sellerAvatar}" 
         alt="${sellerName}" 
         class="w-10 h-10 rounded-full border">
    <div class="ml-3">
      <p class="text-md font-medium">${sellerName}</p>
    </div>`
      }
      </div>
      <!-- Media Section -->
      <div class="relative overflow-hidden w-full h-64 flex-shrink-0">
        <!-- Countdown Timer -->
        <div class="absolute top-1 right-2 z-10 text-sm px-3 py-1 rounded ${
          hasEnded ? 'bg-gray-300 text-black' : 'bg-button text-white'
        }">
          Bidding ${hasEnded ? 'ended' : 'ends'} 
          <span class="font-medium">${hasEnded ? timeSincePosted(endsAt) : timeUntilEnds(endsAt)}</span>
        </div>
        <!-- Slides -->
        ${imagesHtml}
        <!-- Navigation Buttons -->
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

      <div class="flex flex-col flex-grow p-4">
        <!-- Tags -->
        ${
          tags?.length
            ? `<div class="tags-container flex flex-wrap gap-2 mb-4">
                 ${tags
                   .map(
                     (tag) =>
                       `<span class="bg-orange-300 text-black text-xs font-medium px-2 py-1 rounded">${tag}</span>`
                   )
                   .join('')}
               </div>`
            : `<div class="tags-container flex flex-wrap gap-2 mb-4">
                 <span class="bg-gray-300 text-black text-xs font-medium px-2 py-1 rounded">No tags available</span>
               </div>`
        }
        <p class="text-sm text-black">Created: <span>${created ? timeSincePosted(created) : 'N/A'}</span></p>
        <!-- Title -->
        <h1 class="lg:text-xl text-lg text-black font-bold truncate">${title || 'Untitled Auction'}</h1>

        <!-- Description -->
        <p class="lg:text-md text-black mb-2 truncate">${description || 'No description available.'}</p>

        <!-- Spacer -->
        <div class="flex-grow"></div>
  <p class="text-black mt-4  border-t border-gray-200 pt-4">Bids count: <span class="font-medium text-black">${_count?.bids || 0}</span></p>
        <!-- Static Bottom Section -->
        <div class="actions flex justify-between items-center bg-white mt-2 ">
          <!-- Bid Info -->
        
          <p class="border-2 border-primary text-black p-1 rounded-lg">
          ${hasEnded ? 'Final bid' : 'Highest bid'}: 
          <span class="font-medium">$${bids[0]?.amount || '0'}</span>
        </p>
        


          <!-- Bid Button -->
          ${
            isOwner()
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
              : hasEnded
                ? `
                <button class="bg-button text-white px-4 py-2 rounded hover:bg-button-hover">
                <a href="/listings/?id=${id}">Bidding Details</a>
                </button>
                `
                : isLoggedIn()
                  ? `
                  <button class="bg-button text-white px-4 py-2 rounded hover:bg-button-hover"> 
                  <a href="/listings/?id=${id}">
                    Read more</a>
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
    </div>`;

  if (container) {
    container.appendChild(card);
  } else {
    console.error('Container element not found');
  }

  const slides = card.querySelectorAll('.slide');
  const nextBtn = card.querySelector('[data-action="next"]');
  const prevBtn = card.querySelector('[data-action="prev"]');

  let currentIndex = 0;

  const updateSlides = () => {
    slides.forEach((slide, index) => {
      slide.classList.remove(
        'translate-x-0',
        'translate-x-full',
        '-translate-x-full'
      );
      if (index === currentIndex) {
        slide.classList.add('translate-x-0');
      } else if (index > currentIndex) {
        slide.classList.add('translate-x-full');
      } else {
        slide.classList.add('-translate-x-full');
      }
    });
  };

  nextBtn?.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % slides.length;
    updateSlides();
  });

  prevBtn?.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateSlides();
  });

  updateSlides();

  const editButton = card.querySelector('.edit-btn');
  if (editButton) {
    editButton.addEventListener('click', (event) => {
      event.preventDefault();
      window.location.href = `/listings/edit/?id=${id}`;
    });
  }

  const deleteButton = card.querySelector(`[auction-listings-id="${id}"]`);
  if (deleteButton && isOwner) {
    deleteButton.addEventListener('click', () => {
      const modal = document.getElementById('delete-confirmation-modal');
      const confirmDelete = document.getElementById('confirm-delete');
      const cancelDelete = document.getElementById('cancel-delete');

      if (!modal) {
        console.error('Delete confirmation modal not found.');
        return;
      }

      openModal(modal);

      const handleDelete = async () => {
        try {
          await deleteListing(id);
          card.remove();
          showToast('Listing deleted successfully!');
          closeModal(modal);
        } catch (error) {
          console.error('Error deleting listing:', error);
          showToast('Failed to delete listing. Please try again.', 'error');
        } finally {
          confirmDelete.removeEventListener('click', handleDelete);
          cancelDelete.removeEventListener('click', closeModalHandler);
        }
      };

      const closeModalHandler = () => {
        closeModal(modal);
        confirmDelete.removeEventListener('click', handleDelete);
        cancelDelete.removeEventListener('click', closeModalHandler);
      };

      confirmDelete.addEventListener('click', handleDelete);
      cancelDelete.addEventListener('click', closeModalHandler);
    });
  }
}
