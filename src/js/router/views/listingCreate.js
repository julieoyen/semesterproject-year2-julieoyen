import { onCreateListing } from '../../ui/listings/create';
import { authGuard } from '../../utilities/authguard';
import { initDarkMode } from '../../utilities/darkMode';

authGuard();

initDarkMode();

const form = document.forms.createPost;

form.addEventListener('submit', onCreateListing);
