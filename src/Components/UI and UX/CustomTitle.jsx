import React, { useEffect, useState } from "react";

let titleTimeout;
export default function CustomTitle() {
  const [element, setElement] = useState();
  const [title, setTitle] = useState({});

  useEffect(() => {
    if (title.title) {
      const titleDimensions = document
        .getElementById("custom-title")
        .getBoundingClientRect();
      let newDimensions = {
        x: title.x,
        y: title.y,
      };
      if (titleDimensions.width + titleDimensions.left > window.innerWidth) {
        newDimensions.x = title.x - titleDimensions.width;
      }
      if (titleDimensions.height + titleDimensions.top > window.innerHeight) {
        newDimensions.y = title.y - titleDimensions.height - 15;
      }
      setTitle((prevTitle) => ({
        ...prevTitle,
        ...newDimensions,
      }));
    }
  }, [title.title]);

  useEffect(() => {
    function titleEvent(e) {
      clearTimeout(titleTimeout);
      if (Object.entries(title)) {
        setTitle({});
      }
      if (e.target.dataset?.title) {
        setElement(e.target);
        titleTimeout = setTimeout(() => {
          setTitle({
            title: e.target.dataset.title,
            x: e.clientX,
            y: e.clientY + 3,
          });
        }, 800);
      }
    }

    element?.addEventListener("mouseleave", () => {
      clearTimeout(titleTimeout);
    });
    function clearTitle() {
      setTitle({});
    }
    document.addEventListener("mousemove", titleEvent);
    document.addEventListener("mousedown", clearTitle);
    document.addEventListener("wheel", clearTitle);
    return () => {
      element?.removeEventListener("mouseleave", () => {
        clearTimeout(titleTimeout);
      });
      document.removeEventListener("mousemove", titleEvent);
      document.removeEventListener("wheel", clearTitle);
      document.removeEventListener("mousedown", clearTitle);
    };
    // eslint-disable-next-line
  }, [element]);

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
