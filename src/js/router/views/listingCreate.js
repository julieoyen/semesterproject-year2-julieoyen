import { onCreateListing } from '../../ui/listing/create';
import { authGuard } from '../../utilities/authguard';

authGuard();

const form = document.forms.createPost;

form.addEventListener('submit', onCreateListing);
