import { updateListing } from '../../api/listing/update';
import { onUpdateListing } from '../../ui/listing/update';
import { authGuard } from '../../utilities/authguard';
import { createPayload } from '../../api/listing/update';

authGuard();
onUpdateListing();
createPayload();

document
  .querySelector('#edit-listing-form')
  .addEventListener('submit', updateListing);
