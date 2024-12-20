import { submitBid } from '../../api/listings/submitBid';
import { closeModal } from '../../components/modal';
import { getMyCredit } from '../../utilities/getInfo';
import { showToast } from '../../utilities/toast.js';

export async function handleBid({
  id,
  bidAmount,
  highestBid,
  feedback,
  modal,
}) {
  console.log('Starting bid process:', { id, bidAmount, highestBid });

  const availableCredit = getMyCredit(); // Retrieve user's credit from local storage

  // Validate bid amount
  if (isNaN(bidAmount) || bidAmount <= highestBid) {
    feedback.textContent = `Bid must be higher than $${highestBid}.`;
    feedback.classList.remove('hidden');
    return; // Stop further execution
  }

  // Check available credits
  if (bidAmount > availableCredit) {
    feedback.textContent = `You don't have enough credits.`;
    feedback.classList.remove('hidden');
    return; // Stop further execution
  }

  feedback.classList.remove('hidden');

  try {
    const result = await submitBid(id, bidAmount);

    // Handle API-specific errors
    if (result.error) {
      feedback.textContent = result.error;
      feedback.classList.remove('hidden');
      return;
    }

    // Success case
    feedback.classList.add('hidden');
    closeModal(modal);

    // Optionally update user's credit in local storage
    const newCredit = availableCredit - bidAmount;
    localStorage.setItem('userCredit', JSON.stringify(newCredit));

    // Show success toast and refresh data after toast disappears
    showToast('Bid placed successfully!', 'success', () => {
      // Instead of reloading the page, re-fetch the necessary data here
      console.log('Refreshing data after successful bid.');
      location.reload(); // Replace this with dynamic data refresh if possible
    });
  } catch (error) {
    // Show API error message or generic fallback
    feedback.textContent =
      error.message || 'An error occurred while placing your bid.';
    feedback.classList.remove('hidden');
  }
}
