export default function ColorizeIcons(fileextension) {
  fileextension = fileextension.toLowerCase()
  if (fileextension === 'jpg') return '#ff0000'
  if (fileextension === 'mp4') return 'blue'
  if (fileextension === 'json') return '#878372'
  if (fileextension === 'txt') return 'black'
  if (fileextension === 'rtf') return '#938aed'
  if (fileextension === 'png') return '#ff6e6e'
  if (fileextension === 'avi') return '#3223a5'
  if (fileextension === 'wmv') return '#878372'
  if (fileextension === 'html') return '#ffa500'
  if (fileextension === 'db') return '#775832'
  if (fileextension === 'xcf') return 'green'
  if (fileextension === 'ion') return '#281010'
  if (fileextension === 'gif') return 'white'
  if (fileextension === 'js' || fileextension === 'jsx') return 'purple'
  if (fileextension === 'scss' || fileextension === 'css') return 'teal'
}