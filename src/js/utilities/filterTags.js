import { API_AUCTION_LISTINGS } from '../utilities/constants';

const tags = ['jewelry', 'watches', 'art', 'vintage'];

export async function fetchAuctionsByTag(tag, isActive) {
  const API_URL = `${API_AUCTION_LISTINGS}?_tag=${encodeURIComponent(tag)}&_active=${isActive}&_seller=true&_bids=true`;

  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch: ${response.status} ${response.statusText}`
    );
  }

  const result = await response.json();
  return result.data || [];
}

export function createFilterComponent(containerId, onFiltersApplied) {
  const container = document.getElementById(containerId);

  if (!container) {
    console.error(`Container with ID "${containerId}" not found`);
    return;
  }

  container.innerHTML = `
        <div class="container flex flex-col justify-center p-6">
 

            <div class="grid justify-center  p-6 rounded-lg ">
                <div class="flex flex-row font-roboto font-extrabold gap-2" id="filter-tags">
                    <button id="art" class="btn cursor-pointer lg:w-40 lg:h-40 rounded-lg lg:text-xl hover:text-primary">ART<img src="/images/art.png" alt="art-icon"></button>
                    <button id="watches" class="btn cursor-pointer lg:w-40 lg:h-40 rounded-lg lg:text-xl hover:text-primary">WATCHES<img src="/images/watch.png" alt="watches-icon"></button>
                    <button id="vintage" class="btn cursor-pointer lg:w-40 lg:h-40 rounded-lg lg:text-xl hover:text-primary">VINTAGE<img src="images/vintage.png" alt="vintage-icon"></button>
                    <button id="jewelry" class="btn cursor-pointer lg:w-40 lg:h-40  rounded-lg lg:text-xl hover:text-primary">JEWELRY<img src="images/jewelry.png" alt="jewelry"></button>
                   
                </div> 
                
                </div>       
                <div class=" grid justify-center  pb-2 ">
              <div class="mt-4 flex justify-center text-white gap-2 ">
        <button id="show-all" class="btn active cursor-pointer bg-button hover:bg-button-hover py-1 px-2 rounded-lg lg:text-lg text-sm">Show All</button>  
        <button id="highest-bid" class=" bg-button hover:bg-button-hover py-1 px-2 rounded-lg lg:text-lg text-sm">Highest Bids</button>
        <button id="listing-new" class=" bg-button hover:bg-button-hover py-1 px-2 rounded-lg lg:text-lg  text-sm">New Listings</button>
        <button id="listing-ended" class="bg-button hover:bg-button-hover py-1 px-2 rounded-lg lg:text-lg text-sm">Ended Listings</button>
            
            </div>
                </div>

        </div>
    `;

  const filterButtons = document.querySelectorAll('#filter-tags button');
  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const selectedTag = button.id === 'show-all' ? null : button.id;
      onFiltersApplied(selectedTag, true, 'endsAt');
    });
  });

  document.getElementById('show-all').addEventListener('click', () => {
    onFiltersApplied(null, true, 'endsAt');
  });

  document.getElementById('listing-new').addEventListener('click', () => {
    onFiltersApplied(null, true, 'created');
  });

  document.getElementById('listing-ended').addEventListener('click', () => {
    onFiltersApplied(null, false, 'endsAt');
  });

  document.getElementById('highest-bid').addEventListener('click', () => {
    onFiltersApplied(null, true, 'highestBid');
  });
}
