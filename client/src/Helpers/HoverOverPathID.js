export default function HoverOverPathID(path, isHovering) {
  let children = document.querySelectorAll(path);
  children.forEach((child) => {
    child.childNodes.forEach((lineAndCurve) => {
      lineAndCurve.style.backgroundColor = isHovering ? '#d6fd92' : 'red'
    });
  });
}
