import React, { useContext, useState } from "react";
import Filename from "./Icon/Filename";
import { GeneralContext } from "../../Main/App";

export default function ImageGif(props) {
  const { name, thumbPath } = props.directoryItem;
  const { setDirectoryItems } = useContext(GeneralContext);
  const [srcAttempts, setSrcAttempts] = useState(0);

  return (
    thumbPath && (
      <div className="block-container" id="renderitem--image-block">
        <img
          src={thumbPath}
          onError={(e) => {
            e.target.parentElement.classList.add("loading");
            setTimeout(() => {
              if (srcAttempts <= 5) {
                e.target.src = thumbPath;
                setSrcAttempts((prev) => prev + 1);
                e.target.parentElement.classList.remove("loading");
              } else {
                setDirectoryItems((prevItems) => {
                  return prevItems.map((item) => {
                    if (item.name === name) {
                      return {
                        ...item,
                        thumbPath: null,
                      };
                    } else {
                      return item;
                    }
                  });
                });
              }
            }, 1000);
          }}
          alt=""
          className="renderitem--thumbnail"
        />
        <Filename name={name} />
      </div>
    )
  );
}
