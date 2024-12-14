import { register } from '../../api/auth/register.js';
import { login } from '../../api/auth/login.js';
import { showToast } from '../../utilities/toast.js';

export async function onRegister(event) {
  event.preventDefault();

  const generalErrorElement = document.getElementById('general-error');

  generalErrorElement.textContent = '';

  const formData = new FormData(event.target);
  const name = formData.get('name');
  const email = formData.get('email');
  const password = formData.get('password');

  try {
    const registrationData = await register({ name, email, password });

    if (registrationData.error) {
      generalErrorElement.textContent = registrationData.error;
      return;
    }

    const loginData = await login({ email, password });

    if (loginData.error) {
      generalErrorElement.textContent =
        'Registration was successful, but login failed. Please try logging in manually.';

      return;
    }

    localStorage.setItem('token', loginData.data?.accessToken);
    localStorage.setItem('userID', loginData.data?.name);

    showToast(`Welcome, ${loginData.data?.name}!`);

    setTimeout(() => {
      window.location.href = '/';
    }, 3000);
  } catch (error) {
    console.error('Registration Error:', error);
    generalErrorElement.textContent =
      'An unexpected error occurred. Please try again.';
  }
}
