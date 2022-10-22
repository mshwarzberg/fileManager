import React, { useEffect, useState } from "react";

const fs = window.require("fs");
export default function CustomFolderIcon({ path }) {
  const [images, setImages] = useState();

  useEffect(() => {
    try {
      const thumbnails = fs
        .readdirSync(path, { withFileTypes: true })
        .map((item) => {
          if (item.isFile()) {
            return item.name;
          }
        })
        .filter((item) => item && item);

      if (thumbnails[0]) {
        setImages(
          <>
            <image
              id="right"
              href={path + "/" + thumbnails[0]}
              alt=""
              width="50"
              height="65"
              style={{ transform: "rotate(15deg)" }}
            />
            <image
              href={path + "/" + thumbnails[1]}
              alt=""
              height="65"
              width="55"
              style={{ transform: "rotate(-4deg)" }}
            />
          </>
        );
      }
    } catch (error) {}
  }, [path]);

  return (
    <svg viewBox={`0 0 100 100`}>
      <>
        <rect
          name="top-right-dark-corner"
          width="15"
          height="20"
          x="75"
          y="23.2"
          rx="4"
          fill="rgb(218, 156, 18)"
        />
        <rect
          name="top-of-folder"
          fill="rgb(253, 191, 33)"
          width="75"
          height="40"
          x="10"
          y="14"
          clipPath="polygon(40% 0, 55% 23%, 96% 23%, 100% 33%, 100% 100%, 0 100%, 0 0)"
          ry="4"
          rx="4"
        />
        <circle cx="81.7" cy="26.5" r="3" fill="rgb(253, 191, 33)" />
      </>
      <>
        <rect
          width="70"
          height="30"
          x="15"
          y="28"
          fill="rgb(202, 238, 235)"
          name="lighter-sky-blue"
        />
        <rect
          width="70"
          height="30"
          x="15"
          y="33"
          fill="white"
          name="paper-white"
        />
        <rect
          width="5"
          height="5"
          fill="skyblue"
          x="80"
          y="28"
          name="darker-sky-blue"
        />
      </>
      {images}
      <>
        <rect
          width="78"
          height="8"
          rx="4"
          x="11"
          y="78"
          fill="rgb(253, 191, 33)"
          style={{ filter: "drop-shadow( 2px 3px 1px rgba(0, 0, 0, .7))" }}
          name="bottom-of-folder"
        />
        <rect
          width="15"
          height="54"
          x="75"
          y="32.5"
          fill="rgb(253, 191, 33)"
          rx="4"
          name="right-of-folder"
          style={{ filter: "drop-shadow( 2px 1px 1px rgba(0, 0, 0, .7))" }}
        />
        <rect
          fill="rgb(255, 208, 107)"
          width="75"
          height="54"
          x="10"
          y="32.5"
          clipPath="polygon(4% 19%, 50% 19%, 63% 0, 100% 0, 100% 100%, 0 100%, 0 24%)"
          rx="4"
          name="bottom-left-of-folder"
        />
        <rect
          width="5"
          height="5"
          fill="rgb(255, 208, 107)"
          x="80"
          y="32.5"
          name="right-sharpened-corner"
        />
        <circle cx="13.1" cy="45.7" r="3" fill="rgb(255, 208, 107)" />
      </>
    </svg>
  );
}
