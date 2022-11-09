export default function formatDuration(time) {
  if (isNaN(time)) {
    return null;
  }

  let hours = 0;
  let minutes = 0;
  while (time >= 3600) {
    time = time - 3600;
    hours += 1;
  }
  while (time >= 60) {
    time = time - 60;
    minutes += 1;
  }
  let seconds = time || 0;

  if (hours < 10 && hours > 0) {
    hours = `0${hours}`;
  }
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  if (seconds < 10) {
    seconds = `0${seconds}`;
  }
  if (seconds.toString().length > 2) {
    seconds = seconds.toString().slice(0, 2);
  }
  return `${hours ? hours + ":" : ""}${minutes}:${seconds}`;
}
