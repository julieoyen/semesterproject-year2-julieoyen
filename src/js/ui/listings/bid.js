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
  const availableCredit = getMyCredit();

  if (isNaN(bidAmount) || bidAmount <= highestBid) {
    feedback.textContent = `Bid must be higher than $${highestBid}.`;
    feedback.classList.remove('hidden');
    return;
  }

  if (bidAmount > availableCredit) {
    feedback.textContent = `You don't have enough credits.`;
    feedback.classList.remove('hidden');
    return;
  }

  feedback.classList.remove('hidden');

  try {
    const result = await submitBid(id, bidAmount);
    if (result.error) {
      feedback.textContent = result.error;
      feedback.classList.remove('hidden');
      return;
    }

    feedback.classList.add('hidden');
    closeModal(modal);

    const newCredit = availableCredit - bidAmount;
    localStorage.setItem('userCredit', JSON.stringify(newCredit));

    showToast('Bid placed successfully!', 'success', () => {
      location.reload();
    });
  } catch (error) {
    feedback.textContent =
      error.message || 'An error occurred while placing your bid.';
    feedback.classList.remove('hidden');
  }
}
