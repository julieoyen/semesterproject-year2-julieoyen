import { onLogin } from '../src/js/ui/auth/login';

const form = document.forms.login;

form.addEventListener('submit', onLogin);
