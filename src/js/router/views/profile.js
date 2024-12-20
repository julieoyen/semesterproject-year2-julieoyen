import { fetchAllProfileData } from '../../api/profile/read'; // Using fetchProfileData directly
import { renderProfilePage } from '../../ui/profile/read';
import { getNameFromURL } from '../../utilities/getInfo';
import { renderHeader } from '../../components/header';

renderHeader();

const profileName = getNameFromURL();

if (profileName) {
  loadProfile(profileName);
} else {
  console.error('Invalid Profile URL');
  document.body.innerHTML =
    '<p class="text-center text-red-500">Invalid profile URL.</p>';
}

async function loadProfile(profileName) {
  try {
    const profileData = await fetchAllProfileData(profileName);

    if (
      profileData &&
      profileData.profile &&
      profileData.listings &&
      profileData.wins &&
      profileData.bids
    ) {
      const { profile, listings, wins, bids } = profileData;

      renderProfilePage(profile, listings, wins, bids);
    } else {
      throw new Error('Profile, listings, wins, or bids are undefined.');
    }
  } catch (error) {
    console.error('Error loading profile page:', error.message);
  }
}
