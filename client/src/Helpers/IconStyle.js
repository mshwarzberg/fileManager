export default function IconStyle(permission, XY) {
  return {
    cursor: !permission ? "not-allowed" : "pointer",
    backgroundColor: !permission ? "#ff7878c5" : "",
    border: !permission ? "1.5px solid red" : "",
    position: "",
    ...((XY.x || XY.y) && {
      position: "absolute",
      top: XY.y,
      left: XY.x,
      zIndex: 100,
      pointerEvents: "none",
      backgroundColor: "black",
      border: "2px solid pink",
      opacity: 0.8,
    }),
  };
}
