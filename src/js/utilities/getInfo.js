export function getMyName() {
  return localStorage.getItem('userID');
}

export function getMyToken() {
  return localStorage.getItem('token');
}

export function getNameFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('user');
}

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

export function getMyCredit() {
  return JSON.parse(localStorage.getItem('myCredits'));
}
