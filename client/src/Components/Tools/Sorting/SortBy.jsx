import React, { useState, useContext, useEffect } from "react";
import { GeneralContext } from "../../Main/App";

import SortPopup from "./SortPopup";

import downwards from "../../../Assets/images/navigation/downwardshover.png";
import upwards from "../../../Assets/images/navigation/upwardshover.png";

function SortBy() {
  const [showPopup, setShowPopup] = useState(false);
  const [descending, setDescending] = useState(true);

  const { setDirectoryItems } = useContext(GeneralContext);

  useEffect(() => {
    document.addEventListener("click", (e) => {
      if (showPopup && e.target.id !== "navbar--sort-button") {
        setShowPopup(false);
      }
    });
    return () => {
      document.removeEventListener("click", () => {});
    };
  }, [showPopup]);
  return (
    <div>
      <button
        className="navbar--button"
        id="navbar--asc-desc"
        onClick={() => {
          setDescending(!descending);
          setDirectoryItems((prevItems) => {
            let newArray = [];
            prevItems.forEach((item) => {
              newArray.push(item);
            });
            return newArray.reverse();
          });
        }}
      >
        {descending ? (
          <img src={downwards} alt="ascending or descending" />
        ) : (
          <img src={upwards} alt="ascending or descending" />
        )}
      </button>
      <button
        className="navbar--button"
        id="navbar--sort-button"
        onClick={() => {
          setShowPopup(!showPopup);
        }}
        onKeyDown={(e) => {
          let key = e.key.toLowerCase();
          if (key === "r") {
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
