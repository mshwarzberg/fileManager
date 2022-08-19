import React from "react";
import { useEffect } from "react";

let titleTimeout;
export default function CustomTitle({ title, setTitle, contextMenu }) {
  useEffect(() => {
    function titleEvent(e) {
      clearTimeout(titleTimeout);
      if (Object.entries(title)) {
        setTitle({});
      }
      if (e.target.dataset?.title) {
        titleTimeout = setTimeout(() => {
          if (contextMenu.x || contextMenu.y) {
            return;
          }
          setTitle({
            title: e.target.dataset.title,
            x: e.clientX,
            y: e.clientY,
          });
        }, 800);
      }
    }
    function clearTitle() {
      setTitle({});
    }
    document.addEventListener("mousemove", titleEvent);
    document.addEventListener("mousedown", clearTitle);
    document.addEventListener("wheel", clearTitle);
    return () => {
      document.removeEventListener("mousemove", titleEvent);
      document.removeEventListener("wheel", clearTitle);
      document.removeEventListener("mousedown", clearTitle);
    };
    // eslint-disable-next-line
  }, [title.title, contextMenu.x, contextMenu.y]);

  return (
    (title.x || title.y) && (
      <pre
        style={{
          top: title.y,
          left: title.x,
          ...(title.style && JSON.parse(title.style)),
        }}
        id="custom-title"
      >
        <div id="title-background" />
        {title.title}
      </pre>
    )
  );
}
