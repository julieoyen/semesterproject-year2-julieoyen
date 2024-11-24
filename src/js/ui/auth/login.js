import { login } from '../../api/auth/login';
import { showToast } from '../../utilities/toast.js';

export async function onLogin(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const email = formData.get('email');
  const password = formData.get('password');

  if (!email || !password) {
    window.alert('All fields are required.');
    return;
  }
  try {
    const loginData = await login({ email, password });
    if (loginData.error) {
      alert(loginData.error);
      return;
    }
    localStorage.setItem('token', loginData.data.accessToken);
    localStorage.setItem('userID', loginData.data.name);

    showToast(`Welcome, ${loginData.data?.name}!`);

    setTimeout(() => {
      window.location.href = '/';
    }, 3000);
  } catch (error) {
    console.error('Error occurred:', error);
    alert('An unexpected error occurred. Please try again.');
  }
}
