import { onRegister } from '../../ui/auth/register';
import { initDarkMode } from '../../utilities/darkMode';

const form = document.forms.register;

form.addEventListener('submit', onRegister);

initDarkMode();
