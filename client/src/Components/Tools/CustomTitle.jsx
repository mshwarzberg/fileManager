import React from "react";
import { useEffect } from "react";

let titleTimeout;
export default function CustomTitle({ title, setTitle, contextMenu }) {
  useEffect(() => {
    document.addEventListener("mousemove", (e) => {
      e.target.style.cursor = "";
      clearTimeout(titleTimeout);
      setTitle({});
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
          });
          e.target.style.cursor = "none";
        }, 500);
      }
      e.stopPropagation();
    });
    return () => {
      document.removeEventListener("mousemove", () => {});
    };
    // eslint-disable-next-line
  }, [title.title, contextMenu.x, contextMenu.y]);

  return (
    (title.x || title.y) && (
      <pre
        style={{
          top: title.y,
          left: title.x,
          pointerEvents: "none",
        }}
        id="custom-title"
      >
        {title.title}
      </pre>
    )
  );
}
