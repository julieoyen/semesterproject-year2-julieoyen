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
    const data = await login({ email, password });
    if (data.error) {
      alert(data.error);
      return;
    }
    localStorage.setItem('token', data.data.accessToken);
    localStorage.setItem('userID', data.data.name);

    showToast(`Welcome, ${data.data?.name}!`);

    setTimeout(() => {
      window.location.href = '/';
    }, 3000);
  } catch (error) {
    console.error('Error occurred:', error);
    alert('An unexpected error occurred. Please try again.');
  }
}
