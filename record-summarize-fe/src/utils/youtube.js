export function getYoutubeEmbedUrl(url) {
  const reg =
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([A-Za-z0-9_-]{11})/;
  const match = url.match(reg);
  if (!match) return null;
  const videoId = match[1];
  const urlObj = new URL(url);
  urlObj.searchParams.delete("v");
  const extra = urlObj.searchParams.toString();
  return `https://www.youtube.com/embed/${videoId}${extra ? `?${extra}` : ""}`;
}
