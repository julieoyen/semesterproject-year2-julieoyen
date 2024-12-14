import { timeSincePosted, timeUntilEnds } from '../utilities/formatDate';
import { isLoggedIn, getMyToken, getMyName } from '../utilities/getInfo';
import { deleteListing } from '../../js/api/listing/delete';

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

  function isOwner() {
    return isLoggedIn() && getMyName() === seller?.name;
  }

  const loggedIn = isLoggedIn();
  const hasEnded = new Date(endsAt) <= new Date();

  const card = document.createElement('div');
  card.className =
    'border rounded-lg shadow-lg justify-between justify-items-center overflow-hidden max-w-xs mb-5 text-left bg-white flex flex-col min-w-[350px] min-h-[400px]';

  const limitedMedia = media.slice(0, 8);

  const imagesHtml = limitedMedia
    .map((image, index) => {
      return `
        <div class="slide absolute inset-0 transition-transform duration-500 ease-in-out ${
          index === 0 ? 'translate-x-0' : 'translate-x-full'
        }">
          <a href="/listing/?id=${id}">
            <img src="${image.url || '/images/default-img.png'}" 
                 alt="${image.alt || 'Auction Image'}" 
                 class="w-full h-full object-cover"  
                 loading="lazy" 
                 onerror="this.onerror=null; this.src='/images/default-img.png';">
          </a>
        </div>
      `;
    })
    .join('');

  card.innerHTML = `
    <div class="rounded-lg w-full mx-auto bg-white flex flex-col h-full">
      <!-- Seller Information -->
     ${
       loggedIn
         ? `<div class="mx-4 mt-4 flex items-center text-black"><a href="/profile/?user=${seller?.name || 'unknown'}" class="flex items-center mb-3">
      <img src="${seller?.avatar?.url || '/images/default-avatar.png'}" 
           alt="${seller?.avatar?.alt || 'Default Avatar'}" 
           class="w-10 h-10 rounded-full border">
      <div class="ml-3">
        <p class="text-sm font-medium">${seller?.name || 'Unknown Seller'}</p>
      </div>
    </a>
      </div>`
         : `<div class="mx-4 mt-4 mb-3 flex items-center text-black"><img src="${seller?.avatar?.url || '/images/default-avatar.png'}" 
      alt="${seller?.avatar?.alt || 'Default Avatar'}" 
      class="w-10 h-10 rounded-full border">
 <div class="ml-3">
   <p class="text-sm font-medium">${seller?.name || 'Unknown Seller'}</p>
 </div>
 </div>`
     }

      <!-- Media Section -->
      <div class="relative overflow-hidden w-full h-64 flex-shrink-0">
      <!-- Countdown Timer -->
      <div class="absolute top-2 right-2 z-10  text-sm px-3 py-1 rounded ${
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
              <button class="absolute rounded-md bottom-4 right-4 bg-white hover:bg-slate-200 w-8 h-8 flex items-center justify-center text-black" data-action="next">
                &#x276F;
              </button>
              <button class="absolute rounded-md bottom-4 left-4 bg-white hover:bg-slate-200 w-8 h-8 flex items-center justify-center text-black" data-action="prev">
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

  <!-- Static Bottom Section -->
  <div class="actions flex justify-between items-center mt-4 bg-white border-t border-gray-200 pt-4">
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
            <a href="/listing/?id=${id}">Bidding Details</a>
          </button>
          `
          : isLoggedIn()
            ? `
            <button class="bg-button text-white px-4 py-2 rounded hover:bg-button-hover">
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
</div>`;

  if (container) {
    container.appendChild(card);
  } else {
    console.error('Container element not found');
  }

  // Carousel Logic
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
        slide.classList.add('translate-x-0'); // Centered
      } else if (index > currentIndex) {
        slide.classList.add('translate-x-full'); // Slide to the right
      } else {
        slide.classList.add('-translate-x-full'); // Slide to the left
      }
    });
  };

  // Add event listeners for carousel navigation
  nextBtn?.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % slides.length; // Loop back to the first slide
    updateSlides();
  });

  prevBtn?.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length; // Loop back to the last slide
    updateSlides();
  });

  // Initialize the slides
  updateSlides();

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
