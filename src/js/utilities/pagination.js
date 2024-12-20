let currentPage = 1;
let totalPages = 0;

export function updatePaginationButtons(page, total, fetchResults) {
  currentPage = page;
  totalPages = total;

  const prevButton = document.getElementById('prev-button');
  const nextButton = document.getElementById('next-button');
  const currentPageElement = document.getElementById('current-page');
  const totalPagesElement = document.getElementById('total-pages');

  if (currentPageElement) currentPageElement.textContent = currentPage;
  if (totalPagesElement) totalPagesElement.textContent = totalPages;

  prevButton.disabled = currentPage <= 1;
  nextButton.disabled = currentPage >= totalPages;

  prevButton.onclick = async () => {
    if (currentPage > 1) {
      currentPage--;
      await fetchResults(currentPage);
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }
  };

  nextButton.onclick = async () => {
    if (currentPage < totalPages) {
      currentPage++;
      await fetchResults(currentPage);
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }
  };
}
