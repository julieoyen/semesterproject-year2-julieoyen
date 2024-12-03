import './css/style.css';
import router from './js/router/router.js';
import { setLogoutListener } from './js/ui/global/logout';
import { addFavicon } from './js/utilities/linkFavicon.js';

await router(window.location.pathname);

const logoutButton = document.getElementsByClassName('logout-btn');
if (logoutButton) {
  setLogoutListener();
}

addFavicon();
