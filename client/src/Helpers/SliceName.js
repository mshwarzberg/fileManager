export default function sliceName(name) {
  if (name.slice(0, 25) < name) {
    return `${name.slice(0, 25)}...`;
  }
  return name.slice(0, 25);
}