export function timeSincePosted(postedDate) {
  const now = new Date();
  const diff = now - new Date(postedDate);
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const formattedDate = new Date(postedDate).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  if (days > 7) {
    return formattedDate;
  } else if (days >= 1) {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (hours >= 1) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (minutes >= 1) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else {
    return 'Just now';
  }
}

export function timeUntilEnds(endsAt) {
  const now = new Date();
  const endDate = new Date(endsAt);
  const diff = endDate - now;

  if (diff <= 0) {
    return 'Bidding ended';
  }

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const remainingHours = hours % 24;
  const remainingMinutes = minutes % 60;

  const formattedDate = endDate.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  if (days > 7) {
    return ` on <strong>${formattedDate}</strong>`;
  } else if (days >= 1) {
    return `in <strong>${days} day${days > 1 ? 's' : ''}, ${remainingHours} hour${remainingHours !== 1 ? 's' : ''} and ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}</strong>`;
  } else if (hours >= 1) {
    return `in <strong>${hours} hour${hours > 1 ? 's' : ''} and ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}</strong>`;
  } else {
    return `in <strong>${minutes} minute${minutes !== 1 ? 's' : ''}</strong>`;
  }
}
