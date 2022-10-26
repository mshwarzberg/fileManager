export default function formatDate(itemDate, getCustom) {
  let month =
    itemDate.getMonth().toString().length === 1
      ? "0" + (1 * itemDate.getMonth() + 1)
      : 1 * itemDate.getMonth() + 1;
  let date =
    itemDate.getDate().toString().length === 1
      ? "0" + itemDate.getDate()
      : itemDate.getDate();
  let hours =
    itemDate.getHours().toString().length === 1
      ? "0" + itemDate.getHours()
      : itemDate.getHours();
  let minutes =
    itemDate.getMinutes().toString().length === 1
      ? "0" + itemDate.getMinutes()
      : itemDate.getMinutes();
  let seconds =
    itemDate.getSeconds().toString().length === 1
      ? "0" + itemDate.getSeconds()
      : itemDate.getSeconds();

  return `${month}/${date}/${itemDate.getFullYear()} at ${hours}:${minutes}:${seconds}`;
}
