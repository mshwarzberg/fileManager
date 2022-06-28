import { useEffect } from "react";
import useFullscreenElement from "./useFullscreenElement";

export default function useMouseOrKey(
  element,
  listener,
  type,
  alternateControlledElement,
  props
) {
  const { fullscreenControl } = useFullscreenElement(
    alternateControlledElement ? alternateControlledElement : element
  );
  function videoListeners(e) {
    const [miniPlayer, setMiniPlayer] = props;
    const { key } = e;
    switch (key) {
      case " ":
        element.paused ? element.play() : element.pause();
        break;
      case "f":
        setMiniPlayer(false);
        fullscreenControl();
        break;
      case "m":
        element.muted ? (element.muted = false) : (element.muted = true);
        break;
      case "ArrowUp":
        element.volume <= 0.95
          ? (element.volume += 0.05)
          : (element.volume = 1);
        break;
      case "ArrowDown":
        element.volume >= 0.05
          ? (element.volume -= 0.05)
          : (element.volume = 0);
        break;
      case "ArrowRight":
        element.currentTime += 5;
        break;
      case "ArrowLeft":
        element.currentTime -= 5;
        break;
      case "i":
        miniPlayer ? setMiniPlayer(false) : setMiniPlayer(true);
        break;
      case "l":
        element.loop = true;
        break;
      default:
        break;
    }
  }
  function documentListeners(e) {
    const { key } = e;
    switch (key) {
      case "f":
        if (e.ctrlKey) {
          e.preventDefault();
        }
        break;
      default:
        break;
    }
  }
  useEffect(() => {
    document.addEventListener(listener, (e) => {
      if (type === "video" && element) {
        return videoListeners(e);
      }
      if (type === "document" && element) {
        return documentListeners(e);
      }
    });
    return document.removeEventListener(listener, () => {});

    // eslint-disable-next-line
  }, [element]);
}
