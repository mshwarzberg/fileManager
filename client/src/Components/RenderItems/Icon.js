import React from "react";
import ChooseIcon from "../../Helpers/ChooseIcon";
import SliceName from "../../Helpers/SliceName";

function Icon(props) {
  const { name, shorthandsize, fileextension, itemtype, thumbnail } = props;

  return (
    !thumbnail && (
      <div
        className="renderfile--block"
        title={`Name: ${name}\nSize: ${shorthandsize}\nType: ${fileextension}`}
      >
        <img
          src={ChooseIcon(itemtype)}
          onMouseEnter={(e) => {
            e.currentTarget.src = ChooseIcon(itemtype, true);
          }}
          onMouseLeave={(e) => {
            e.currentTarget.src = ChooseIcon(itemtype);
          }}
          alt="fileicon"
          className="renderfile--full-icon"
        />
        <p className="renderfile--text">Item name: {SliceName(name)}</p>
      </div>
    )
  );
}

export default Icon;
