//components/modal.js
export function closeModal(modal) {
  if (modal) {
    modal.classList.add('hidden');
  }
}

export function openModal(modal) {
  if (modal) {
    modal.classList.remove('hidden');
  }
}

export function setupModalHandlers(options, onOpen, onSubmit) {
  const modal = document.getElementById(options.modalId);
  const triggerButtons = document.querySelectorAll(options.triggerClass);
  const closeButton = document.getElementById(options.closeId);
  const cancelButton = document.getElementById(options.cancelId);
  const form = document.getElementById(options.formId);

  if (!modal) {
    console.error(`Modal with ID ${options.modalId} not found.`);
    return;
  }

  if (!triggerButtons.length) {
    console.error(`No buttons found with class ${options.triggerClass}.`);
    return;
  }

  if (!form || !(form instanceof HTMLFormElement)) {
    console.error(`Form with ID ${options.formId} is invalid or not found.`);
    return;
  }

  triggerButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const auctionId = button.dataset.auctionId; // Get the auction ID from the button
      modal.dataset.auctionId = auctionId; // Pass it to the modal
      onOpen?.(modal, form);
      openModal(modal);
    });
  });

  const closeModalHandler = () => closeModal(modal);
  closeButton?.addEventListener('click', closeModalHandler);
  cancelButton?.addEventListener('click', closeModalHandler);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData(form);
      await onSubmit?.(formData, modal);
    } catch (error) {
      console.error('Error during form submission:', error.message);
    }
  });
}
