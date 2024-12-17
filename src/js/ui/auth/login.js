import { login } from '../../api/auth/login';
import { showToast } from '../../utilities/toast.js';

export async function onLogin(event) {
  event.preventDefault();

  const generalErrorElement = document.getElementById('general-error');

  generalErrorElement.textContent = '';

  const formData = new FormData(event.target);
  const email = formData.get('email');
  const password = formData.get('password');

  let hasError = false;

  if (!email || email.trim() === '') {
    generalErrorElement.textContent = 'Email is required.';
    hasError = true;
  }

  if (!password || password.trim() === '') {
    generalErrorElement.textContent = 'Password is required.';
    hasError = true;
  }

  if (hasError) {
    return;
  }

  try {
    const data = await login({ email, password });

    if (data.error) {
      generalErrorElement.textContent =
        data.error || 'Invalid username or password.';
      return;
    }

    localStorage.setItem('token', data.data.accessToken);
    localStorage.setItem('userID', data.data.name);
    localStorage.setItem('userAvatar', JSON.stringify(data.data.avatar));

    showToast(`Welcome back, ${data.data?.name}!`);

    setTimeout(() => {
      window.location.href = '/';
    }, 3000);
  } catch (error) {
    console.error('Error occurred:', error);
    generalErrorElement.textContent =
      'An unexpected error occurred. Please try again.';
  }
}
