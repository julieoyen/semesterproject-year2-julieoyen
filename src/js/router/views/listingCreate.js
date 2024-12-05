import { authGuard } from '../../utilities/authGuard';
import { onCreateListing } from '../../ui/listing/create';

authGuard();

const form = document.forms.createPost;

form.addEventListener('submit', onCreateListing);
