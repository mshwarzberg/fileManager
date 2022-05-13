import React, { useState } from "react";
import SortPopup from "./SortPopup";

function SortBy(props) {
  const { setItemsInDirectory } = props;

  const [showPopup, setShowPopup] = useState(false);
  const [descending, setDescending] = useState(true);

  return (
    <div>
        <button
          className="navbar--button"
          id="navbar--asc-desc"
          onClick={() => {
            setDescending(!descending);
          }}
          title={`Click to sort ${descending ? 'ascending' : 'descending'}`}
        >
          {descending ? '↓' : '↑'}
        </button>
      <button
        className="navbar--button"
        id="navbar--sort-button"
        onClick={() => {
          setShowPopup(!showPopup)
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
