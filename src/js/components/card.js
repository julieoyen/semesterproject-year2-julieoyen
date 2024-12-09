import { timeSincePosted, timeUntilEnds } from '../utilities/formatDate';
import { isLoggedIn, getMyToken, getMyName } from '../utilities/getInfo';
import { deleteListing } from '../../js/api/listing/delete';

export function renderAuctionCard(
  info,
  container,
  allowedTags = ['art', 'watches', 'jewelry', 'vintage']
) {
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

  function isOwner() {
    return isLoggedIn() && getMyName() === seller?.name;
  }

  const hasEnded = new Date(endsAt) <= new Date();

  const card = document.createElement('div');
  card.className =
    'border rounded-lg shadow-lg justify-between justify-items-center overflow-hidden max-w-96 mb-5 text-left bg-white flex flex-col';

  const limitedMedia = media.slice(0, 3);

  const imagesHtml = limitedMedia
    .map((image, index) => {
      return `
    <div class="slide absolute inset-0 transition-transform duration-500 ease-in-out ${
      index === 0 ? 'translate-x-0' : 'translate-x-full'
    }">
      <img src="${image.url || '/images/default-img.png'}" 
           alt="${image.alt || 'Auction Image'}" 
           class="w-full h-full bg-white text-black object-cover" 
           loading="lazy" 
           onerror="this.onerror=null; this.src='/images/default-img.png';">
    </div>
    `;
    })
    .join('');

  card.innerHTML = `
    <div class="rounded-lg w-full mx-auto bg-white flex flex-col h-full">
      <div class="mx-4 mt-4 flex items-center text-black">
        <a href="/profile/?author=${seller?.name || ''}" class="flex items-center mb-3">
          <img src="${seller?.avatar?.url || '/images/default-img.png'}" 
               alt="${seller?.avatar?.alt || seller?.name || 'Seller Avatar'}" 
               class="w-10 h-10 rounded-full border">
          <div class="ml-3">
            <p class="text-sm font-medium">${seller?.name || 'Unknown Seller'}</p>
          </div>
        </a>
      </div>
      <div class="flex flex-col flex-grow">
        <div class="relative overflow-hidden w-full h-64"> 
          ${imagesHtml}
          <button class="absolute rounded-md bottom-4 right-4 bg-white hover:bg-slate-200 w-8 h-8 items-center justify-center text-black cursor-pointer hidden" data-action="next">
            &#x276F;
          </button>
          <button class="absolute rounded-md bottom-4 left-4 bg-white hover:bg-slate-200 w-8 h-8 items-center justify-center text-black cursor-pointer hidden" data-action="prev">
            &#x276E;
          </button>
        </div>
        <div class="p-4 flex flex-col flex-grow justify-between">
          <div>
          ${
            tags?.length
              ? `<div class="tags-container flex flex-wrap gap-2 mb-4">
                   ${tags
                     .filter((tag) => allowedTags.includes(tag.toLowerCase()))
                     .map(
                       (tag) =>
                         `<span class="bg-orange-300 text-black text-xs font-medium px-2 py-1 rounded">${tag}</span>`
                     )
                     .join('')}
                 </div>`
              : ``
          } 
            <p class="text-sm text-black">Created: <span>${created ? timeSincePosted(created) : 'N/A'}</span></p>
            <h1 class="lg:text-2xl text-xl  text-black font-bold">${title || 'Untitled Auction'}</h1>
            <p class="lg:text-lg text-black mb-2">${description || 'No description available.'}</p>
          </div>
 <div class="mt-auto p-2 text-sm text-gray-600">
          <div class="flex flex-row text-black justify-between pb-2">
            <p>Bids: <span class="font-medium">${_count?.bids || 0}</span></p>
            <p>${hasEnded ? 'Final bid' : 'Current bid'}: 
              <span class="font-medium">$${bids[0]?.amount || '0'}</span></p>
              </div>          
             
            <p class="border-2 border-primary rounded-lg mt-auto p-2 text-sm text-gray-600 ">Bidding ${hasEnded ? 'ended' : 'ends'} 
              <span class="font-medium">${hasEnded ? timeSincePosted(endsAt) : timeUntilEnds(endsAt)}</span></p>
          </div>
          <div class="mt-4 flex justify-between">
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
                  ? ''
                  : isLoggedIn()
                    ? `<button class="bg-button text-white px-4 py-2 rounded hover:bg-button-hover">Bid Now</button>`
                    : `<div class="grid grid-cols-2 justify-between">
                         <div class="flex justify-center text-center items-center">
                           <p class="text-black text-center">Want to place a bid?</p>
                         </div>
                         <div class="flex justify-end">
                           <button class="bg-button text-white px-4 py-2 rounded hover:bg-button-hover">
                             <a href="/auth/login/">Login</a>
                           </button>
                         </div>
                       </div>`
            }
          </div>
        </div>
      </div>
    </div>
  `;

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

  if (slides.length > 1) {
    nextBtn?.classList.remove('hidden');
    prevBtn?.classList.remove('hidden');
  }

  if (container) {
    container.appendChild(card);
  } else {
    console.error('Container element not found');
  }

  const editButton = card.querySelector('.edit-btn');
  if (editButton) {
    editButton.addEventListener('click', (event) => {
      event.preventDefault();
      window.location.href = `/listing/edit/?id=${id}`;
    });
  }

  const deleteButton = card.querySelector(`[auction-listings-id="${id}"]`);

  if (deleteButton && isOwner()) {
    deleteButton.addEventListener('click', async () => {
      const confirmed = confirm('Are you sure you want to delete this post?');
      if (confirmed) {
        try {
          await deleteListing(id);
          card.remove();
          console.log(`Listing with ID ${id} deleted successfully.`);

          const event = new CustomEvent('listingDeleted', { detail: { id } });
          document.dispatchEvent(event);
        } catch (error) {
          console.error(`Failed to delete listing: ${error.message}`);
          alert('Failed to delete the post. Please try again.');
        }
      }
    });
  }
}
