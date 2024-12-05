import { onCreateListing } from '../../ui/listing/create';
import { authGuard } from '../../utilities/authGuard.js';

authGuard();

const form = document.forms.createPost;

form.addEventListener('submit', onCreateListing);
