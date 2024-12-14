import { updateProfile } from '../../api/profile/update';
import { setupModalHandlers, closeModal } from '../../components/modal';

// Avatar Modal
setupModalHandlers(
  {
    modalId: 'banner-modal',
    triggerClass: '.edit-banner-btn',
    closeId: 'close-banner-modal',
    cancelId: 'cancel-banner-button',
    formId: 'edit-banner-form',
  },
  (modal, form) => {
    // Pre-fill the form with current values
    const bioText = document.getElementById('bio-text').textContent || '';
    const avatarUrl = document.querySelector('.profile-header img').src || '';
    const bannerStyle =
      document.querySelector('.profile-header').style.backgroundImage;
    const bannerUrl = bannerStyle?.slice(5, -2) || '';

    form.querySelector('#avatar-url').value = avatarUrl;
    form.querySelector('#banner-url').value = bannerUrl;
    form.querySelector('#bio-textarea').value = bioText;
  },
  async (formData, modal) => {
    const avatarUrl = formData.get('avatar-url');
    const bannerUrl = formData.get('banner-url');
    const bioText = formData.get('bio-textarea');

    try {
      await updateProfile(bioText, { avatar: avatarUrl, banner: bannerUrl });

      // Update the UI with new values
      const profileHeader = document.querySelector('.profile-header');
      const avatarImg = profileHeader.querySelector('img');
      avatarImg.src = avatarUrl;

      profileHeader.style.backgroundImage = `url(${bannerUrl})`;
      profileHeader.style.backgroundSize = 'cover';
      profileHeader.style.backgroundPosition = 'center';

      document.getElementById('bio-text').textContent = bioText;

      closeModal(modal);
      renderProfilePage(getMyName());
    } catch (error) {
      console.error('Failed to update profile:', error.message);
    }
  }
);
