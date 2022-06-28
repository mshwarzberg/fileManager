import React, { useState } from "react";
import leftArrow from "../../../Assets/images/navigate-backwards.png";
import leftHover from "../../../Assets/images/menu.png";

function SortPopup(props) {
  const { setDirectoryItems, descending } = props;

  const [showSubSort, setShowSubSort] = useState(false);

  function mySort(sortMethod, type) {
    setDirectoryItems((prevItems) => {
      if (sortMethod === "folder") {
        prevItems.sort((item) => {
          return item.itemtype !== "folder";
        });
      } else if (sortMethod === "name") {
        prevItems.sort((a, b) => {
          a = a.name.toLowerCase();
          b = b.name.toLowerCase();
          return a > b;
        });
      } else if (sortMethod === "size" || sortMethod === "duration") {
        prevItems.sort((a, b) => {
          return b[sortMethod] - a[sortMethod];
        });
      } else if (sortMethod === "date") {
        prevItems
          .sort((a, b) => {
            return a.modified > b.modified;
          })
          .reverse();
      } else if (type) {
        prevItems
          .sort((item) => {
            return item.fileextension === type;
          })
          .reverse();
      }
      let sortedArray = [...prevItems];
      return descending ? sortedArray : sortedArray.reverse();
    });
  }

  const arrayOfFileTypes = [
    "avi",
    "avif",
    "bmp",
    "css",
    "cur",
    "docx",
    "ico",
    "ion",
    "jpeg",
    "jpg",
    "js",
    "json",
    "jsx",
    "md",
    "mkv",
    "mp4",
    "png",
    "py",
    "rtf",
    "scss",
    "svg",
    "tiff",
    "txt",
    "webm",
    "wmv",
  ];

  const fileTypes = arrayOfFileTypes.map((type) => {
    return (
      <li
        key={type}
        onClick={() => {
          mySort("type", type);
        }}
      >
        {type}
      </li>
    );
  });

  return (
    <ol id="filter--list">
      <li
        onClick={() => {
          mySort("folder");
        }}
      >
        ...Folders First
      </li>
      <li
        onClick={() => {
          mySort("name");
        }}
      >
        ...Name
      </li>
      <li
        onClick={() => {
          mySort("size");
        }}
      >
        ...File Size
      </li>
      <li
        onClick={() => {
          mySort("duration");
        }}
        data-title="For videos and gifs"
      >
        ...File Duration
      </li>
      <li
        onClick={() => {
          mySort("date");
        }}
      >
        ...Date Added
      </li>
      <li
        id="hide"
        style={{ fontSize: "1rem" }}
        onMouseOver={(e) => {
          if (e.target.id === "hide") {
            setShowSubSort(false);
          }
        }}
      >
        <div id="left-arrow">
          <img
            src={leftArrow}
            alt="expand types"
            onMouseEnter={(e) => {
              setShowSubSort(true);
              e.target.src = leftHover;
            }}
            onMouseLeave={(e) => {
              e.target.src = leftArrow;
            }}
          />
        </div>
        <p>...File Type</p>
        {showSubSort && <ol>{fileTypes}</ol>}
      </li>
    </ol>
  );
}

export default SortPopup;
