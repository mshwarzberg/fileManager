import React, { useState } from "react";

function SortPopup(props) {
  const { setItemsInDirectory, descending } = props;
  
  const [showSubSort, setShowSubSort] = useState(false);
  const [isFolderSorted, setIsFolderSorted] = useState(false);

  function mySort(sortMethod, type) {
    setItemsInDirectory((prevItems) => {

      let sortedArray = [];
      let sortDirection = descending;

      if (sortMethod === "folder") {
        if (isFolderSorted) {
          return prevItems;
        }
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
          return item.fileextension !== type;
        });
      }

      prevItems.forEach((item) => {
        sortedArray.push(item);
      });

      if (sortedArray === prevItems) {
        return prevItems
      }
      return sortDirection ? sortedArray : sortedArray.reverse();
    });
    if (sortMethod === 'folder') {
      setIsFolderSorted(true)
    } else {
      setIsFolderSorted(false)
    }
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
        ...Folders First
      </li>
      <li
        className="filter--list-item"
        id="filter--by-folder-second"
        onClick={() => {
          mySort("name");
        }}
      >
        ...Name
      </li>
      <li
        className="filter--list-item"
        id="filter--by-folder-third"
        onClick={() => {
          mySort("size");
        }}
      >
        ...File Size
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
        ...File Type
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
            <li
              className="filter--list-item"
              onClick={() => {
                mySort("type", "xcf");
              }}
            >
              xcf
            </li>
            <li
              className="filter--list-item"
              onClick={() => {
                mySort("type", "rtf");
              }}
            >
              rtf
            </li>
          </ol>
        )}
      </li>
      <li className="filter--list-item" id="filter--by-folder-fifth">
        ...Date
      </li>
    </ol>
  );
}

export default SortPopup;
