export default function CompareArray(a, b) {
  if (!b || !b[0] ) {
    return false
  }
  for (let i in a) {
    if (b[i]) {
      if (a[i].name !== b[i].name || a[i].size !== b[i].size){
        return false
      }
    }
  }
  return true
}