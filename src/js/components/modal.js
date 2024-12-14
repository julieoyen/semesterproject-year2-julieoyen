export function closeModal(modal) {
  if (modal) {
    console.log('Closing modal:', modal);
    modal.classList.add('hidden');
  }
}

export function openModal(modal) {
  if (modal) {
    console.log('Opening modal:', modal);
    modal.classList.remove('hidden');
  }
}

export function setupModalHandlers(options, onOpen, onSubmit) {
  const modal = document.getElementById(options.modalId);
  const triggerButton = document.querySelector(options.triggerClass);
  const closeButton = document.getElementById(options.closeId);
  const cancelButton = document.getElementById(options.cancelId);
  const form = document.getElementById(options.formId);

  // Log the form to ensure it exists
  console.log('Form element:', form);

  if (!modal) {
    console.error(`Modal with ID ${options.modalId} not found.`);
    return;
  }

  if (!triggerButton) {
    console.error(
      `Trigger button with class ${options.triggerClass} not found.`
    );
    return;
  }

  if (!form || !(form instanceof HTMLFormElement)) {
    console.error(`Form with ID ${options.formId} is invalid or not found.`);
    return;
  }

  triggerButton.addEventListener('click', () => {
    console.log(`${options.triggerClass} clicked, opening modal.`);
    onOpen?.(modal, form); // Pass modal and form to onOpen callback
    openModal(modal);
  });

  const closeModalHandler = () => closeModal(modal);
  closeButton?.addEventListener('click', closeModalHandler);
  cancelButton?.addEventListener('click', closeModalHandler);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!form || !(form instanceof HTMLFormElement)) {
      console.error('Invalid form element in submit handler:', form);
      return;
    }

    try {
      const formData = new FormData(form);
      console.log('FormData created successfully:', formData);

      // Log all formData entries
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      await onSubmit?.(formData, modal);
    } catch (error) {
      console.error('Error during form submission:', error.message);
    }
  });
}
