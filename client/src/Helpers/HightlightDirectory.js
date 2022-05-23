export default function HighlightDirectory(path, compare) {

  let numberOfSlices = compare.length
  for (let i = compare.length; i > 0; i--) {
    if (compare[i] === '/') {
      compare = compare.slice(0, numberOfSlices)
      return path === compare
    }
    numberOfSlices--
  }

}