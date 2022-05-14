import React from 'react'
import DownArrow from "../../../../Assets/images/down-arrow.png";
import RightArrow from "../../../../Assets/images/right-arrow.png";

export default function ParentDir(props) {

  const {openDirName, margin, openDirectory} = props

  return (
    <div
        style={{
          marginLeft: `${margin * 7}px`,
        }}
        className="directorytree--expanded-directory"
      >
        <div className="line--down" />
        <p className="directorytree--parent-directory">
          <img
            onClick={(e) => {
              if (e.target.parentElement.nextSibling.style.display === "") {
                e.target.parentElement.nextSibling.style.display = "none";
                e.target.src = RightArrow;
              } else {
                e.target.parentElement.nextSibling.style.display = "";
                e.target.src = DownArrow;
              }
            }}
            className="directorytree-parent-down"
            src={DownArrow}
            alt=""
          />
          {openDirName}
        </p>
        <div className="directorytree--open-directories">{openDirectory}</div>
      </div>
  )
}
