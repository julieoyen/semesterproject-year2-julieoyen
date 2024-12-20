/**
 * Displays a toast message with optional styling for success or error types.
 * @param {string} message - The message to display in the toast.
 * @param {'success' | 'error'} [type='success'] - Type of toast, determines the background color.
 */
export function showToast(message, type = 'success', callback) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.className = `hidden fixed inset-0 flex items-center justify-center z-50 bg-opacity-90 p-4 rounded-lg transition-opacity duration-300 font-roboto text-xl ease-in-out`;

  if (type === 'error') {
    toast.classList.add('bg-red-500', 'text-white');
  } else {
    toast.classList.add('bg-background-dark', 'text-white');
  }

  toast.textContent = message;
  toast.classList.remove('hidden', 'opacity-0');

  setTimeout(() => {
    toast.classList.add('opacity-0');
    setTimeout(() => {
      toast.classList.add('hidden');
      if (callback) callback();
    }, 300);
  }, 3000);
}
