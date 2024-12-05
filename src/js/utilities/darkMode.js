function toggleDarkMode() {
  document.documentElement.classList.toggle('dark');

  if (document.documentElement.classList.contains('dark')) {
    localStorage.setItem('theme', 'dark');
  } else {
    localStorage.setItem('theme', 'light');
  }
}

export function initDarkMode() {
  const currentTheme = localStorage.getItem('theme');
  const toggleInput = document.getElementById('toggle');

  if (currentTheme) {
    if (currentTheme === 'dark') {
      document.documentElement.classList.add('dark');
      if (toggleInput) toggleInput.checked = true;
    } else {
      document.documentElement.classList.remove('dark');
      if (toggleInput) toggleInput.checked = false;
    }
  } else {
    const prefersDarkScheme = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
    if (prefersDarkScheme) {
      document.documentElement.classList.add('dark');
      if (toggleInput) toggleInput.checked = true;
    } else {
      document.documentElement.classList.remove('dark');
      if (toggleInput) toggleInput.checked = false;
    }
  }

  if (toggleInput) {
    toggleInput.addEventListener('change', toggleDarkMode);
  }
}
