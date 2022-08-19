export default function CheckIfExists(
  array,
  value,
  compareValue,
  secondaryValue,
  secondaryCompareValue
) {
  for (const element of array) {
    if (element[compareValue] === value) {
      if (secondaryValue) {
        if (element[secondaryCompareValue] === secondaryValue) {
          return true;
        } else {
          return false;
        }
      }
      return true;
    }
  }
  return false;
}
