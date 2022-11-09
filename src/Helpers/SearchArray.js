export function findInArray(array, value, compareKey) {
  if (!array) {
    return false;
  }
  for (const element of array) {
    if (element[compareKey] === value) {
      return true;
    }
  }
  return false;
}
