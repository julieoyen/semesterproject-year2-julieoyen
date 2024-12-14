import { renderProfilePage } from '../../ui/profile/read';
import { getNameFromURL } from '../../utilities/getInfo';
import { initMenu } from '../../utilities/hamburgerMenu';
import { renderHeader } from '../../components/header';

renderHeader();
initMenu();

const profileName = getNameFromURL();
console.log('Extracted Profile Name:', profileName);

if (profileName) {
  renderProfilePage(profileName);
} else {
  console.error('Invalid Profile URL');
  document.body.innerHTML =
    '<p class="text-center text-red-500">Invalid profile URL. Please check the link and try again.</p>';
}
