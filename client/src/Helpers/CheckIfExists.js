export default function CheckIfExists(array, value, compareValue) {
  for (const element of array) {
    if (element[compareValue] === value) {
      return true;
    }
  }
  return false;
}
