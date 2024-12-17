//Retrieve userID from local storage
export function getMyName() {
  return localStorage.getItem('userID');
}
//Retrieve Token from local storage
export function getMyToken() {
  return localStorage.getItem('token');
}

//Retrieve name of seller from URL
export function getNameFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('user');
}

//Retrieve post from ID from URL
export function getIDFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

export function isLoggedIn() {
  return !!getMyToken();
}

export function getMyAvatar() {
  return JSON.parse(localStorage.getItem('userAvatar'));
}
