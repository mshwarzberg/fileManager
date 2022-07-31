export default function FormatDate(itemDate, getCustom) {
  let month =
    itemDate.getMonth().toString().length === 1
      ? "0" + (1 * itemDate.getMonth() + 1)
      : 1 * itemDate.getMonth() + 1;
  let date =
    itemDate.getDate().toString().length === 1
      ? "0" + itemDate.getDate()
      : itemDate.getDate();
  let hours =
    itemDate.getHours().toString().length + 1 === 1
      ? "0" + itemDate.getHours() + 1
      : itemDate.getHours() + 1;
  let minutes =
    itemDate.getMinutes().toString().length === 1
      ? "0" + itemDate.getMinutes()
      : itemDate.getMinutes();
  let seconds =
    itemDate.getSeconds().toString().length === 1
      ? "0" + itemDate.getSeconds()
      : itemDate.getSeconds();
  if (getCustom) {
    let day = itemDate.getDay();
    let months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    let week = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    return `${week[day]}, ${
      months[parseInt(month) - 1]
    } ${date} ${itemDate.getFullYear()} at ${hours}:${minutes}:${seconds}`;
  }
  return `${month}/${date}/${itemDate.getFullYear()} at ${
    hours}:${minutes}:${seconds}`;
}
