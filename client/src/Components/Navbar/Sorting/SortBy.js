import React, { useState } from "react";
import SortPopup from "./SortPopup";

function SortBy(props) {
  const { setItemsInDirectory } = props;

  const [showPopup, setShowPopup] = useState(false);
  const [descending, setDescending] = useState(true);

  return (
    <div>
      <div id="navbar--asc-or-desc">
        <button
          disabled={descending}
          id="navbar--descending"
          onClick={() => {
            setDescending(true);
          }}
        >
          Descending ↓
        </button>
        <button
          disabled={!descending}
          id="navbar--ascending"
          onClick={() => {
            setDescending(false);
          }}
        >
          Ascending ↑
        </button>
      </div>
      <button
        className="navbar--button"
        id="navbar--sort-button"
        onMouseEnter={() => {
          setShowPopup(true);
        }}
        onMouseLeave={() => {
          setShowPopup(false);
        }}
        onDoubleClick={() => {
          setItemsInDirectory((prevItems) => {
            var i, j, k;
            let newArray = [...prevItems];
            for (i = newArray.length - 1; i > 0; i--) {
              j = Math.floor(Math.random() * i);
              k = newArray[i];
              newArray[i] = newArray[j];
              newArray[j] = k;
            }
            return newArray;
          });
        }}
      >
        {" "}
        Sort By...{" "}
        {showPopup && (
          <SortPopup
            setItemsInDirectory={setItemsInDirectory}
            descending={descending}
            setDescending={setDescending}
          />
        )}
      </button>
    </div>
  );
}

export default SortBy;
