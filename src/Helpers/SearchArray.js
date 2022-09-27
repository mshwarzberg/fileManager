export function findInArray(array, value, compareKey) {
  for (const element of array) {
    if (element[compareKey] === value) {
      return true;
    }
  }
  return false;
}
