import React from "react";
import ChooseIcon from "../../Helpers/ChooseIcon";
import SliceName from "../../Helpers/SliceName";

function Icon(props) {
  const { item, changeFolderOrViewFiles, itemsInDirectory } = props;

  const {name, shorthandsize, fileextension, itemtype, thumbnail} = item

  return (
    !thumbnail && (
      <div
        className="renderfile--block"
        title={`Name: ${name}\nSize: ${shorthandsize}\nType: ${fileextension}`}
        onClick={() => {
          changeFolderOrViewFiles(itemtype, name, itemsInDirectory.indexOf(item))
        }}
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
        <p className="renderfile--text">{SliceName(name)}</p>
      </div>
    )
  );
}

export default Icon;
