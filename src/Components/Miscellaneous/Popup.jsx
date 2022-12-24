import { useState, useEffect, useContext } from "react";
import { GeneralContext } from "../Main/Main.tsx";

export default function Popup({ popup, setPopup }) {
  const { body, ok, cancel, thirdButton, popupLabel } = popup;

  const [drag, setDrag] = useState(false);
  const {
    views: { appTheme },
  } = useContext(GeneralContext);

  useEffect(() => {
    function handleMouseMove(e) {
      if (drag) {
        const popup = document.getElementById("popup-body");
        const popupDimensions = popup.getBoundingClientRect();

        popup.style.left = e.clientX - popupDimensions.width / 2 + "px";
        popup.style.top = e.clientY + popupDimensions.height / 2 - 10 + "px";
      }
    }
    function handleMouseUp() {
      setDrag();
    }
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [drag]);

  return (
    <div id="popup-body" className={`popup-body-${appTheme}`}>
      <div
        className={`frame-top-${appTheme}`}
        id="frame-top"
        onMouseDown={() => {
          setDrag(true);
        }}
      >
        {popupLabel}
      </div>
      <div id="close-container">
        <button
          className={`button-${appTheme}`}
          id="close"
          onClick={() => {
            setPopup({});
          }}
        >
          X
        </button>
      </div>
      {body}
      <div id="buttons-container">
        <div id="buttons">
          {thirdButton}
          {cancel}
          {ok}
        </div>
      </div>
    </div>
  );
}
