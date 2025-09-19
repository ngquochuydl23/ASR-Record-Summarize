export function timeToSeconds(time) {
  return time
    .split(":")
    .map(Number)
    .reduce((acc, val) => acc * 60 + val, 0);
}
