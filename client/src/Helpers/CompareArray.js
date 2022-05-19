export default function CompareArray(a, b) {
  if (b === undefined) {
    return false
  }
  for (let i in a) {
    if (a[i].name !== b[i].name || a[i].size !== b[i].size){
      return false
    }
  }
  return true
}