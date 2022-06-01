import { useState, useEffect } from "react";

export default function useDisplayAnimation(item) {
  const [itemClass, setItemClass] = useState("viewitem--item loaded");

  useEffect(() => {
    document.addEventListener("keydown", (e) => {
      item?.current?.addEventListener("load", () => {
        item.current.style.display = 'none'
        if (item && item.current) {
          if (e.key === "ArrowRight") {
            setItemClass("viewitem--item fromright");
            item.current.style.display = "block";
            item.current?.addEventListener("animationend", () => {
              setItemClass("viewitem--item");
            });
          }
          if (e.key === "ArrowLeft") {
            setItemClass("viewitem--item fromleft");
            item.current.style.display = "block";
            item.current?.addEventListener("animationend", () => {
              setItemClass("viewitem--item");
            });
          }
        }
      });
    });

    return () => {
      document.removeEventListener("keydown", () => {});
    };
  });

  return { itemClass };
}
