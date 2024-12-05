const searchButton = document.getElementById('search-button');
const searchField = document.getElementById('searchbar-field');

let searchQuery = ''; // To store the search query

searchField.addEventListener('input', (e) => {
  searchQuery = e.target.value.trim(); // Get the search query as user types

  if (searchQuery.length > 0) {
    loadPosts(1, searchQuery); // Start from the first page if searching
  } else {
    loadPosts(1); // If no search query, load all posts
  }
});

// Close search bar when clicked outside
if (searchField && searchButton) {
  window.addEventListener('click', (e) => {
    if (!searchField.contains(e.target) && !searchButton.contains(e.target)) {
      searchField.classList.add('hidden');
    }
  });
}
