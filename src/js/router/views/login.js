import { onLogin } from '../../ui/auth/login';
import { initDarkMode } from '../../utilities/darkMode';

const form = document.forms.login;

form.addEventListener('submit', onLogin);

const darkMode = document.getElementById('dark-mode');

initDarkMode();
