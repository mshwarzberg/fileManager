export function foundInArrayWithKey(array, value, compareKey) {
  for (const element of array) {
    if (element[compareKey] === value) {
      return true;
    }
  }
  return false;
}

export function foundInArrayObject(array, values, compareKeys, key) {
  for (const item of array) {
    if (!item[key]) {
      return false;
    }
    if (
      item[key][compareKeys[0]] === values[0] &&
      item[key][compareKeys[1]] === values[1]
    ) {
      return true;
    }
  }
  return false;
}
