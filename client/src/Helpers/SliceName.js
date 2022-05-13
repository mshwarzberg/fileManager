export default function sliceName(name) {
  if (name.slice(0, 30) < name) {
    return `${name.slice(0, 30)}...`;
  }
  return name.slice(0, 30);
}