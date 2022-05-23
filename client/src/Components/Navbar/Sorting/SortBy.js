import React, { useState } from "react";
import SortPopup from "./SortPopup";

import upwards from "../../../Assets/images/navigation/upwards.png";
import downwards from "../../../Assets/images/navigation/downwards.png";
import downhover from "../../../Assets/images/navigation/downwardshover.png";
import uphover from "../../../Assets/images/navigation/upwardshover.png";

function SortBy(props) {
  const { setDirectoryItems } = props;

  const [showPopup, setShowPopup] = useState(false);
  const [descending, setDescending] = useState(true);

  return (
    <div>
        <button
        onMouseEnter={(e) =>  {
          if (descending) {
            e.target.firstChild.src = downhover 
          } else {
            e.target.firstChild.src = uphover
          }
        }}
        onMouseLeave={(e) =>  {
          if (descending) {
            e.target.firstChild.src = downwards 
          } else {
            e.target.firstChild.src = upwards
          }
        }}
          className="navbar--button"
          id="navbar--asc-desc"
          onClick={(e) => {
            setDescending(!descending);
            setDirectoryItems(prevItems => {
              let newArray = []
              prevItems.forEach(item => {
                newArray.push(item)
              })
              return newArray.reverse()
            })
            // state won't change until next render so using the 'old' version to set the icon
            if (!descending) {
              e.currentTarget.firstChild.src = downhover 
            } else {
              e.currentTarget.firstChild.src = uphover
            }
          }}
          title={`Click to sort ${descending ? 'ascending' : 'descending'}`}
        >
          <img src={downwards} alt="ascending or descending" />
        </button>
      <button
        className="navbar--button"
        id="navbar--sort-button"
        onClick={() => {
          setShowPopup(!showPopup)
        }}
        title="Click here and press 'r' to sort randomly"
        onKeyDown={(e) => {
          if (e.key === 'r') {
            setDirectoryItems((prevItems) => {
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
          }
        }}
      >
        Sort By...
        {showPopup && (
          <SortPopup
            setDirectoryItems={setDirectoryItems}
            descending={descending}
            setDescending={setDescending}
          />
        )}
      </button>
    </div>
  );
}

export default SortBy;
