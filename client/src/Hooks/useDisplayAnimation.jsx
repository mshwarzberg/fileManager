import { useState, useEffect } from "react";

export default function useDisplayAnimation(item) {
  const [itemClass, setItemClass] = useState("viewitem--item loaded");

  function handleAnimation(e) {
    e.preventDefault()
    if (item && item.current) {
      if (e.key === "ArrowRight") {
        setItemClass("viewitem--item fromright");
        item.current?.addEventListener("animationend", () => {
          setItemClass("viewitem--item");
        });
      }
      if (e.key === "ArrowLeft") {
        setItemClass("viewitem--item fromleft");
        item.current?.addEventListener("animationend", () => {
          setItemClass("viewitem--item");
        });
      }
    }
  }

  useEffect(() => {
    document.addEventListener("keydown", (e) => {
      var observer = new MutationObserver(() => {
        handleAnimation(e);
        observer.disconnect();
      });

      observer.observe(document, {
        attributes: true,
        childList: true,
        characterData: true,
        subtree: true,
      });
    });

    return () => {
      document.removeEventListener("keydown", () => {});
    };
  });

  return { itemClass };
}
