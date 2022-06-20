import { useState } from "react";

export default function useFullscreenElement(element) {
  const [fullscreen, setFullscreen] = useState();

  function fullscreenControl() {
    let item = element ? element : document.querySelector("#fullscreen");

    if (!document.fullscreenElement) {
      item.requestFullscreen();
      setFullscreen(true);
    } else {
      setFullscreen(false);
      document.exitFullscreen();
    }
  }

  return { fullscreenControl, fullscreen, setFullscreen };
}
