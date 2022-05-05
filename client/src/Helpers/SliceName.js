export default function sliceName(name) {
  if (name.slice(0, 35) < name) {
    return `${name.slice(0, 35)}...`;
  }
  return name.slice(0, 35);
}