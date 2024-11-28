import { onLogout } from '../auth/logout';

export function setLogoutListener() {
  const logoutButtons = document.querySelectorAll('.logout-btn');
  logoutButtons.forEach(button => {
    button.addEventListener('click', onLogout);
  });
}
