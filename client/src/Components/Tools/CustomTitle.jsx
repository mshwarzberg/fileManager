import React from "react";
import { useEffect } from "react";

let titleTimeout;
export default function CustomTitle({ title, setTitle, contextMenu }) {
  useEffect(() => {
    document.addEventListener("mousemove", (e) => {
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
        }, 500);
      }
      e.stopPropagation();
    });
    document.addEventListener("click", () => {
      setTitle({});
    });
    return () => {
      document.removeEventListener("mousemove", () => {});
      document.removeEventListener("click", () => {});
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
