import React, { useState } from "react";

function SortPopup(props) {
  const { setItemsInDirectory, descending } = props;

  const [showSubSort, setShowSubSort] = useState(false);

  function mySort(sortMethod, type) {
    setItemsInDirectory((prevItems) => {
      let sortedArray = [];
      let sortDirection = descending;

      if (sortMethod === "folder") {
        // top down
        prevItems.sort((item) => {
          return item.itemtype !== "folder";
        });
      }
      if (sortMethod === "name") {
        // top down
        prevItems.sort((a, b) => {
          a = a.name.toLowerCase();
          b = b.name.toLowerCase();
          if (a < b) return -1;
          if (a > b) return 1;
          return 0;
        });
      }
      if (sortMethod === "size") {
        // top down
        prevItems.sort((a, b) => {
          return b.size - a.size;
        });
      }
      if (type) {
        // top down
        prevItems.sort((item) => {
          return item.fileextension !== type;
        });
      }

      prevItems.forEach((item) => {
        sortedArray.push(item);
      });
      console.log(sortDirection, sortedArray);
      return sortDirection ? sortedArray : sortedArray.reverse();
    });
  }

  return (
    <ol
      id="filter--list"
      className="navbar--button"
      onDoubleClick={(e) => {
        e.stopPropagation();
      }}
    >
      <li
        className="filter--list-item"
        id="filter--by-folder-first"
        onClick={() => {
          mySort("folder");
        }}
      >
        Sort Folders First
      </li>
      <li
        className="filter--list-item"
        id="filter--by-folder-second"
        onClick={() => {
          mySort("name");
        }}
      >
        Sort By Name
      </li>
      <li
        className="filter--list-item"
        id="filter--by-folder-third"
        onClick={() => {
          mySort("size");
        }}
      >
        Sort By File Size
      </li>
      <li
        className="filter--list-item"
        id="filter--by-folder-fourth"
        onMouseEnter={() => {
          setShowSubSort(true);
        }}
        onMouseLeave={() => {
          setShowSubSort(false);
        }}
      >
        Sort By File Type
        {showSubSort && (
          <ol className="filter--sublist">
            <li
              className="filter--list-item"
              onClick={() => {
                mySort("type", "jpg");
              }}
            >
              jpg
            </li>
            <li
              className="filter--list-item"
              onClick={() => {
                mySort("type", "mp4");
              }}
            >
              mp4
            </li>
            <li
              className="filter--list-item"
              onClick={() => {
                mySort("type", "png");
              }}
            >
              png
            </li>
            <li
              className="filter--list-item"
              onClick={() => {
                mySort("type", "txt");
              }}
            >
              txt
            </li>
            <li
              className="filter--list-item"
              onClick={() => {
                mySort("type", "gif");
              }}
            >
              gif
            </li>
          </ol>
        )}
      </li>
      <li className="filter--list-item" id="filter--by-folder-fifth">
        Sort By Date
      </li>
    </ol>
  );
}

export default SortPopup;
