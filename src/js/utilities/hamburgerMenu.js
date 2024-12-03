export function initMenu() {
  const hamburgerBtn = document.getElementById('hamburger-button');
  const mobileMenu = document.getElementById('mobile-menu');

  if (hamburgerBtn && mobileMenu) {
    hamburgerBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }
}
