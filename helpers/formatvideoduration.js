function formatDuration(time, value = 1) {
  let percentage = (time * value) / 100;
  hours = 0;
  minutes = 0;
  while (percentage > 3600) {
    percentage = percentage - 3600;
    hours += 1;
  }
  while (percentage > 60) {
    percentage = percentage - 60;
    minutes += 1;
  }
  let seconds = percentage || 0;
  if (hours < 10) {
    hours = `0${hours}`;
  }
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  if (seconds < 10) {
    seconds = `0${seconds}`;
  }
  if (seconds.toString().length > 4) {
    seconds = seconds.toString().slice(0, 5);
  }
  return `${hours}:${minutes}:${seconds}`;
}

module.exports = { formatDuration };
