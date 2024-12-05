import { initDarkMode } from '../utilities/darkMode';
import { getMyName, getMyToken } from '../utilities/getInfo';
import { fetchAuctions } from '../router/views/listing';

export function renderHeader() {
  const header = document.createElement('header');
  header.className =
    'sticky top-0 z-10 border-gray-200 dark:bg-background-dark';

  const isLoggedIn = () => {
    const token = getMyToken();
    const name = getMyName();
    return token && name;
  };
  const myName = getMyName();

  const loggedInUserDesktop = `

    <div class="flex items-center">
      <nav class="hidden text-2xl text-black dark:text-white md:block" aria-label="Main Navigation">
        <ul class="flex flex-row justify-center space-x-8" role="menu">
          <li role="none">
              <a role="menuitem" id="my-profile-link"  href="/profile/?author=${myName}" class="hover:text-primary bg-background-dark rounded-full text-white dark:hover:text-primary" aria-label="View Profile">
                <svg class="w-[31px] h-[31px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path fill-rule="evenodd" d="M12 20a7.966 7.966 0 0 1-5.002-1.756l.002.001v-.683c0-1.794 1.492-3.25 3.333-3.25h3.334c1.84 0 3.333 1.456 3.333 3.25v.683A7.966 7.966 0 0 1 12 20ZM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10c0 5.5-4.44 9.963-9.932 10h-.138C6.438 21.962 2 17.5 2 12Zm10-5c-1.84 0-3.333 1.455-3.333 3.25S10.159 13.5 12 13.5c1.84 0 3.333-1.455 3.333-3.25S13.841 7 12 7Z" clip-rule="evenodd"/>
                </svg>
              </a>
          </li>
          <li role="none">
            <a role="menuitem" class="hover:text-button dark:hover:text-primary" href="/listing/create/">Create Listing</a>
          </li>
          <li role="none">
            <button role="menuitem" class="hover:text-button dark:hover:text-primary logout-btn" aria-label="Log out">
              <svg class="w-[31px] h-[31px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H8m12 0-4 4m4-4-4-4M9 4H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h2"/>
              </svg>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  `;

  const noUserDesktop = `
  <div class="pb-3">
  <input type="checkbox" class="peer sr-only opacity-0" id="toggle" />
  <label
    id="dark-mode"
    for="toggle"
    class="absolute top-2 right-4 flex cursor-pointer items-center rounded-full bg-background-dark px-0.5 transition-colors h-5 w-9 before:h-4 before:w-4 sm:h-6 sm:w-11 sm:before:h-5 sm:before:w-5 before:rounded-full before:bg-white before:shadow before:transition-transform before:duration-300 peer-checked:bg-blue-600 peer-checked:before:bg-blue-100 peer-checked:before:translate-x-full peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue-600 dark:bg-blue-900 dark:peer-checked:bg-background-light dark:before:bg-gray-500 dark:peer-checked:before:bg-background-dark"
    aria-label="Enable Dark Mode">
    <span class="sr-only bg-white text-black">Enable Dark Mode</span>
  </label>
</div>
    <div class="flex flex-row pb-3">
      <div class="flex">
        <button>
          <a href="/auth/login/" class="px-6 py-2 hover:text-button dark:text-white dark:hover:text-white font-medium transition-all duration-300 lg:mr-4">
            <svg class="w-[27px] h-[27px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path fill-rule="evenodd" d="M12 20a7.966 7.966 0 0 1-5.002-1.756l.002.001v-.683c0-1.794 1.492-3.25 3.333-3.25h3.334c1.84 0 3.333 1.456 3.333 3.25v.683A7.966 7.966 0 0 1 12 20ZM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10c0 5.5-4.44 9.963-9.932 10h-.138C6.438 21.962 2 17.5 2 12Zm10-5c-1.84 0-3.333 1.455-3.333 3.25S10.159 13.5 12 13.5c1.84 0 3.333-1.455 3.333-3.25S13.841 7 12 7Z" clip-rule="evenodd"/>
            </svg>
          </a>
        </button>
      </div>
      <div class="flex items-center max-sm:ml-auto">
        <nav class="md:block text-center" aria-label="Main Navigation">
          <ul class="flex lg:space-x-4 space-x-2">
            <li class="relative px-1 flex items-center justify-center">
              <a href="/auth/register/" class="text-white hover:bg-primary_hover bg-primary px-4 py-2 rounded-lg dark:text-white dark:hover:text-white font-medium lg:mr-4">Sign up</a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  `;

  const loggedInUserMobile = `
  <div class="pb-3">
  <input type="checkbox" class="peer sr-only opacity-0" id="toggle" />
  <label
    id="dark-mode"
    for="toggle"
    class="absolute top-2 right-4 flex cursor-pointer items-center rounded-full bg-background-dark px-0.5 transition-colors h-5 w-9 before:h-4 before:w-4 sm:h-6 sm:w-11 sm:before:h-5 sm:before:w-5 before:rounded-full before:bg-white before:shadow before:transition-transform before:duration-300 peer-checked:bg-blue-600 peer-checked:before:bg-blue-100 peer-checked:before:translate-x-full peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue-600 dark:bg-blue-900 dark:peer-checked:bg-background-light dark:before:bg-gray-500 dark:peer-checked:before:bg-background-dark"
    aria-label="Enable Dark Mode">
    <span class="sr-only bg-white text-black">Enable Dark Mode</span>
  </label>
</div>
    <div class="block lg:mr-9 mr-3">
      <button
        id="hamburger-button"
        class="relative h-8 w-8 mx-2 cursor-pointer text-3xl md:hidden"
        aria-label="Toggle Navigation Menu"
        aria-expanded="false"
        aria-controls="mobile-menu">
        <div class="absolute top-4 -mt-0.5 h-1 w-8 rounded bg-background-dark dark:bg-white transition-all duration-500 before:absolute before:h-1 before:w-8 before:-translate-x-4 before:-translate-y-3 before:rounded before:bg-background-dark before:dark:bg-white before:transition-all before:duration-500 before:content-[''] after:absolute after:h-1 after:w-8 after:-translate-x-4 after:translate-y-3 after:rounded after:bg-background-dark after:dark:bg-white after:transition-all after:duration-500 after:content-['']"></div>
      </button>
      <div class="flex flex-col absolute">
        <div
          id="mobile-menu"
          class="hidden animate-open-menu bg-background-light text-black dark:text-background-light dark:bg-background-dark text-xl"
          role="dialog"
          aria-labelledby="mobile-menu-title">
          <nav class="absolute flex text-center mt-2 right-0 min-w-[180px] bg-white shadow-md p-2 rounded-md">
            <ul role="menu">
              <li role="option" aria-label="My Profile" class="cursor-pointer flex items-center p-3 hover:bg-gray-100">
                <i class="fa-regular fa-user text-primary"></i>
                <a id="my-profile-mobile" href="/profile/?author=${myName}" class="ml-2 text-background-dark">My Profile</a>
              </li>
              <li role="option" aria-label="Create Post" class="cursor-pointer flex items-center p-3 text-background-dark hover:bg-gray-100">
                <i class="fa-regular fa-square-plus text-primary"></i>
                <a href="/post/create/" id="create-btn" class="ml-2 text-background-dark">Create Post</a>
              </li>
              <hr class="my-2 border-slate-200" />
              <li role="option" aria-label="Sign Out" class="cursor-pointer flex items-center p-3 hover:bg-gray-100">
                <button role="menuitem" class="hover:text-button text-background-dark logout-btn" aria-label="Log out">
                  <i class="fa-solid fa-right-from-bracket text-primary"></i> Logout
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  `;

  const loggedInUser = loggedInUserDesktop + loggedInUserMobile;
  const notLoggedInUser = noUserDesktop;

  header.innerHTML = `
    <div class="grid grid-flow-col items-center justify-between py-3 px-4 sm:px-10 bg-background-light dark:bg-background-dark lg:gap-y-4 gap-y-6 gap-x-4">
      <a href="/"><img class="h-24 w-24 sm:h-auto sm:w-fill object-cover" src="/images/bidalonglogo.png" alt="Bidalong Logo" /></a>
      <div
      id="search-menu"
      class="relative flex items-center justify-center"
      role="search"
      aria-labelledby="search-menu-label">

      <label id="search-menu-label" class="sr-only" for="searchbar-field">Search the site</label>
      <div
        class="flex lg:px-4 lg:py-3 md:px-3 md:py-2 px-2 py-1 rounded-md border-2 text-background-dark bg-white dark:bg-white border-secondary overflow-hidden my-x font-roboto focus-within:ring-2 focus-within:ring-primary focus-within:outline-none"
        aria-label="Search field container">

        <button 
          class="mr-3" 
          type="button" 
          aria-label="Submit search" 
          tabindex="0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192.904 192.904" width="16px" class="fill-primary dark:fill-background-dark rotate-90" role="img" aria-hidden="true">
            <title>Search Icon</title>
            <path
              d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z"
            ></path>
          </svg>
        </button>

        <input
          type="text"
          id="searchbar-field"
          placeholder="Search..."
          class="w-full outline-none dark:text-black bg-transparent text-sm focus:ring-2"
          aria-label="Search the site" />
      </div>
    </div>
    
      <div>
        ${isLoggedIn() ? loggedInUser : notLoggedInUser}
      </div>
    </div>
  `;

  document.body.prepend(header);
  initDarkMode();
}
