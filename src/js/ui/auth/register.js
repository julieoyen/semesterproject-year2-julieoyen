import { register } from '../../api/auth/register.js';

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
    const data = await register({ name, email, password });
    if (data.error) {
      alert(data.error);
      return;
    }
    localStorage.setItem('token', data.data.accessToken);
    localStorage.setItem('userID', data.data.name);
    alert(`User: ${data.data.name} (${data.data.email}) created`);
    window.location.href = '/';
  } catch (error) {
    console.error('Error occurred:', error);
    alert('An unexpected error occurred. Please try again.');
  }
}
