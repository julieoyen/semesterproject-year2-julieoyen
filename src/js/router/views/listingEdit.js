import { updateListing } from '../../api/listings/update';
import { onUpdateListing } from '../../ui/listings/update';
import { authGuard } from '../../utilities/authguard';
import { createPayload } from '../../api/listings/update';

authGuard();
onUpdateListing();
createPayload();

document
  .querySelector('#edit-listing-form')
  .addEventListener('submit', updateListing);
