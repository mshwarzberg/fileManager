import React from "react";
import { useEffect } from "react";

let titleTimeout;
export default function CustomTitle({ title, setTitle, contextMenu }) {
  useEffect(() => {
    let active = true;
    function titleEvent(e) {
      clearTimeout(titleTimeout);
      if (Object.entries(title)) {
        setTitle({});
      }
      if (e.target.dataset?.title || e.target.parentElement?.dataset.title) {
        titleTimeout = setTimeout(() => {
          if (contextMenu.x || contextMenu.y) {
            return;
          }
          setTitle({
            title:
              e.target.dataset.title || e.target.parentElement?.dataset.title,
            x: e.clientX,
            y: e.clientY,
            ...((e.target.dataset.style ||
              e.target.parentElement?.dataset.style) && {
              style:
                e.target.dataset.style || e.target.parentElement.dataset.style,
            }),
          });
        }, 500);
      }
    }
    document.addEventListener("mousemove", titleEvent);
    document.addEventListener("mousedown", () => {
      if (active) {
        setTitle({});
      }
    });
    return () => {
      active = false;
      document.removeEventListener("mousemove", titleEvent);
      document.removeEventListener("mousedown", () => {});
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
        {title.title}
      </pre>
    )
  );
}
