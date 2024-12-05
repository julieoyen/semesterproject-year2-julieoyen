import { authGuard } from '../../utilities/authguard';
import { onCreateListing } from '../../ui/listing/create';

authGuard();

const form = document.forms.createPost;

form.addEventListener('submit', onCreateListing);
