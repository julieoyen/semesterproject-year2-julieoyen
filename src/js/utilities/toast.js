export function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) {
    console.error('Toast container not found.');
    return;
  }

  toast.textContent = message;
  toast.classList.remove('hidden', 'opacity-0');

  setTimeout(() => {
    toast.classList.add('opacity-0');
    setTimeout(() => {
      toast.classList.add('hidden');
    }, 300);
  }, 3000);
}
