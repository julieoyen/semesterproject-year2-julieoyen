import { register } from '../../api/auth/register.js';
import { login } from '../../api/auth/login.js';
import { showToast } from '../../utilities/toast.js';

export async function onRegister(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const name = formData.get('name');
  const email = formData.get('email');
  const password = formData.get('password');

  if (!name || !email || !password) {
    window.alert('All fields are required.');
    return;
  }

  try {
    const registrationData = await register({ name, email, password });
    if (registrationData.error) {
      alert(registrationData.error);
      return;
    }
    const loginData = await login({ email, password });

    if (loginData.error) {
      alert(
        'Registration was successful, but login failed. Please try to login again.'
      );
    }

    localStorage.setItem('token', loginData.data?.accessToken);
    localStorage.setItem('userID', loginData.data?.name);

    showToast(`Welcome, ${loginData.data?.name}!`);

    setTimeout(() => {
      window.location.href = '/';
    }, 3000);
  } catch (error) {
    console.error('Error occurred:', error);
    alert('An unexpected error occurred. Please try again.');
  }
}
