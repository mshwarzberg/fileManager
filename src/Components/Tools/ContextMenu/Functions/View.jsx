import React, { useState, useContext } from "react";
import rightArrow from "../../../../Assets/images/navigate-forwards.png";
import { UIContext } from "../../GeneralUI";
export default function View() {
  const [showSubMenu, setShowSubMenu] = useState(false);
  const { setContextMenu } = useContext(UIContext);

  const views = ["Extra Small", "Small", "Medium", "Large", "Extra Large"];
  const viewOptions = views.map((item) => {
    return (
      <button
        className="context-menu-item"
        key={item}
        onClick={() => {
          let width;
          if (item === "Extra Small") {
            width = 6.5;
          } else if (item === "Small") {
            width = 8.5;
          } else if (item === "Medium") {
            width = 9.5;
          } else if (item === "Large") {
            width = 13;
          } else if (item === "Extra Large") {
            width = 18;
          }
          const iconClassList =
            document.getElementsByClassName("renderitem--block");
          for (const i of iconClassList) {
            i.style.width = width + "rem";
          }
          localStorage.setItem("blockWidth", width + "rem");
          setContextMenu({});
        }}
      >
        {item} Icons
      </button>
    );
  });
  return (
    <div className="context-menu-item">
      View
      <img
        src={rightArrow}
        alt="options"
        onMouseEnter={() => {
          setShowSubMenu(true);
        }}
      />
      {showSubMenu && <div id="sub-menu">{viewOptions}</div>}
    </div>
  );
}
