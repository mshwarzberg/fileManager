import React, { useState } from "react";

function SortPopup(props) {
  const { setDirectoryItems, descending } = props;

  const [showSubSort, setShowSubSort] = useState(false);

  function mySort(sortMethod, type) {
    setDirectoryItems((prevItems) => {
      let sortedArray = [];
      let sortDirection = descending;

      if (sortMethod === "folder") {
        prevItems.sort((item) => {
          return item.itemtype !== "folder";
        });
      } else if (sortMethod === "name") {
        prevItems.sort((a, b) => {
          a = a.name.toLowerCase();
          b = b.name.toLowerCase();
          if (a < b) return -1;
          if (a > b) return 1;
          return 0;
        });
      } else if (sortMethod === "size") {
        prevItems.sort((a, b) => {
          return b.size - a.size;
        });
      } else if (type) {
        prevItems.sort((item) => {
          console.log(item);
          return item.fileextension === type;
        });
      }

      prevItems.forEach((item) => {
        sortedArray.push(item);
      });

      if (sortedArray === prevItems) {
        return prevItems;
      }
      return sortDirection ? sortedArray : sortedArray.reverse();
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
    "wmv"
  ]

  const fileTypes = arrayOfFileTypes.map(type => {
    return <li key={type} onClick={() => {
      mySort('type', type)
    }}>
      {type}
    </li>
  })

  return (
    <ol
      id="filter--list"
    >
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
      <li>...Date</li>
      <li
        onMouseEnter={() => {
          setShowSubSort(true);
        }}
        onMouseLeave={() => {
          setShowSubSort(false);
        }}
      >
        ...File Type
        {showSubSort && (
          <ol>
            {fileTypes}
          </ol>
        )}
      </li>
    </ol>
  );
}

export default SortPopup;
