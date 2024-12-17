// ui/listings/bid.js
import { submitBid } from '../../api/listings/submitBid';
import { closeModal } from '../../components/modal';
import { getCredits } from '../../utilities/getCredit';

const availableCredit = getCredits();

export async function handleBid({
  id,
  bidAmount,
  highestBid,
  feedback,
  modal,
}) {
  console.log('Starting bid process:', { id, bidAmount, highestBid });

  // Validate bid amount
  if (isNaN(bidAmount) || bidAmount <= highestBid) {
    feedback.textContent = `Bid must be higher than $${highestBid}`;
    feedback.classList.remove('hidden');
    return;
  }

  feedback.textContent = 'Placing bid...';
  feedback.classList.remove('hidden');

  try {
    const result = await submitBid(bidAmount);

    if (result.error) {
      feedback.textContent = result.error || 'Failed to place bid.';
      feedback.classList.remove('hidden');
      return;
    }

    closeModal(modal);
    alert('Bid placed successfully!');
    location.reload(); // Refresh page to reflect updated bids
  } catch (error) {
    console.error('Error during bid process:', error.message);
    feedback.textContent = error.message || 'Failed to place bid.';
    feedback.classList.remove('hidden');
  }
}
