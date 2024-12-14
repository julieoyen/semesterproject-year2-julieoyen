import { API_KEY } from './constants';
import { getKey } from '../api/auth/key';

export function headers() {
  const headers = new Headers();

  if (API_KEY) {
    headers.append('X-Noroff-API-Key', API_KEY);
  }

  return headers;
}

export async function loggedInHeaders() {
  const token = await getKey();
  const headers = new Headers();

  if (API_KEY) {
    headers.append('X-Noroff-API-Key', API_KEY);
    headers.append('Content-Type', 'application/json');
  }

  if (API_KEY) {
    headers.append('Authorization', `Bearer ${token}`);
  }

  return headers;
}
