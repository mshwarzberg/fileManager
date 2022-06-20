import { useEffect } from "react";

export default function useContainWithinScreen(
  tag,
  setStateFunction,
  dependency
) {
  useEffect(() => {
    const element = document.querySelector(tag);
    if (element) {
      const { y, x, width, height } = element.getBoundingClientRect();

      setStateFunction((prevState) => ({
        ...prevState,
        x: x + width > document.body.clientWidth ? x - width : prevState.x,
        y: y + height > document.body.clientHeight ? y - height : prevState.y,
      }));
    }
    // eslint-disable-next-line
  }, [...dependency]);
}
