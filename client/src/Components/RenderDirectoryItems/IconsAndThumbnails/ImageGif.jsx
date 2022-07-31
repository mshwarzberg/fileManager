import React, { useContext } from "react";
import Filename from "./Icon/Filename";
import loading from "../../../Assets/images/loading.png";
import { GeneralContext } from "../../Main/App";

export default function ImageGif(props) {
  let timeout;
  let srcAttempts = 0;
  let { name, thumbPath, permission } = props.item;
  const { setDirectoryItems } = useContext(GeneralContext);

  return (
    thumbPath && (
      <div
        className="block-container"
        id="renderitem--image-block"
        onMouseDown={(e) => {
          if (e.button === 0) {
            e.stopPropagation();
            return;
          }
        }}
      >
        <img
          style={{ cursor: !permission ? "not-allowed" : "pointer" }}
          src={thumbPath}
          onError={(e) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
              e.target.id = "loading";
              e.target.src = loading;
            }, 0);
            setTimeout(() => {
              if (srcAttempts <= 5) {
                e.target.src = thumbPath;
                e.target.id = "";
                srcAttempts++;
              } else {
                e.target.id = "";
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
