import React, { useState } from "react";

function SortPopup(props) {
  const { setItemsInDirectory, descending,setDescending } = props;

  const [showSubSort, setShowSubSort] = useState(false);

  function sort(sortMethod, type) {
    setItemsInDirectory((prevItems) => {
      prevItems.sort((a, b) => {
        if (sortMethod === 'size') {
          return a.size - b.size;
        }
        else if (sortMethod) {
          if (type === 'folder') {
            return a.itemtype === type
          }
          if (type === 'name') {
            return a.name
          }
          return a.fileextension === type
        } 
        return a.sortMethod
      });

      let sortedArray = [];
      prevItems.forEach((item) => {
        sortedArray.push(item);
      });
      if (!descending) {
        return sortedArray
      }
      return sortedArray.reverse()
    });

    // if (value === "folders") {
    //   return setItemsInDirectory((prevItems) => {
    //     let sortedArray = [];
    //     let otherItems = [];
    //     prevItems.map((item) => {
    //       if (item.itemtype === "folderIcon") {
    //         return sortedArray.push(item);
    //       }
    //       return otherItems.push(item);
    //     });

    //     sortedArray = sortedArray.concat(otherItems);
    //     return sortedArray;
    //   });
    // } else if (value === "size") {
    //   return setItemsInDirectory((prevItems) => {
    //     prevItems.sort((a, b) => {
    //       return a.size - b.size;
    //     });
    //     let sortedArray = [];
    //     prevItems.forEach((item) => {
    //       sortedArray.push(item);
    //     });
    //     if (descending) {
    //       sortedArray.reverse();
    //     }
    //     return sortedArray;
    //   });

    // } else if (value === 'name') {
    //   return setItemsInDirectory((prevItems) => {
    //     prevItems.sort((item) => {
    //       return item.name
    //     })
    //     let sortedArray = []
    //     prevItems.forEach((item) => {
    //       sortedArray.push(item)
    //     })
    //     if (descending) {
    //       sortedArray.reverse();
    //     }
    //     return sortedArray
    //   })
    // }
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
          sort("folder", 'folder');
        }}
      >
        Sort Folders First
      </li>
      <li
        className="filter--list-item"
        id="filter--by-folder-second"
        onClick={() => {
          sort("name");
        }}
      >
        Sort By Name
      </li>
      <li
        className="filter--list-item"
        id="filter--by-folder-third"
        onClick={() => {
          sort("size");
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
                sort("type", "jpg");
              }}
            >
              jpg
            </li>
            <li
              className="filter--list-item"
              onClick={() => {
                sort("type", "mp4");
              }}
            >
              mp4
            </li>
            <li
              className="filter--list-item"
              onClick={() => {
                sort("type", "png");
              }}
            >
              png
            </li>
            <li
              className="filter--list-item"
              onClick={() => {
                sort("type", "txt");
              }}
            >
              txt
            </li>
            <li
              className="filter--list-item"
              onClick={() => {
                sort("type", "gif");
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
