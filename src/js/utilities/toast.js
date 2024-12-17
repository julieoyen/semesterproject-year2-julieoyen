/**
 * Displays a toast message with optional styling for success or error types.
 * @param {string} message - The message to display in the toast.
 * @param {'success' | 'error'} [type='success'] - Type of toast, determines the background color.
 */
export function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.classList.remove(
    'hidden',
    'opacity-0',
    'bg-green-500',
    'bg-red-500',
    'text-white'
  );

  if (type === 'error') {
    toast.classList.add('bg-red-500', 'text-white');
  } else {
    toast.classList.add('bg-green-500', 'text-white');
  }

  toast.textContent = message;
  toast.classList.remove('hidden', 'opacity-0');

  setTimeout(() => {
    toast.classList.add('opacity-0');
    setTimeout(() => toast.classList.add('hidden'), 300);
  }, 3000);
}
