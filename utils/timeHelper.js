function getPostedText(date) {
  const now = new Date();
  const posted = new Date(date);

  const diffDays = Math.floor((now - posted) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "today";
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 7) return `${diffDays} days ago`;

  const weeks = Math.floor(diffDays / 7);
  if (weeks === 1) return "1 week ago";
  return `${weeks} weeks ago`;
}

module.exports = { getPostedText };