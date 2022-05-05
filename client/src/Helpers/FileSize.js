// turn the byte integers from the filesize to more readable format
export default function shortHandFileSize(originalSize) {

  let newSize;
  let letter

  if (originalSize < 1000) {
    newSize = originalSize
    letter = ''
  }
  else if (originalSize > 1000 && originalSize < 950000) {
    newSize = originalSize / 1000;
    letter = 'K'
  } else if (originalSize >= 950000 && originalSize < 950000000) {
    newSize = originalSize / 1000000;
    letter = 'M'
  } else if (originalSize >= 950000000) {
    newSize = originalSize / 1000000000;
    letter = 'G'
  } else {
    return originalSize
  }

  newSize = newSize.toString().slice(0, 5);
  newSize += `${letter}B`;

  return newSize;
}