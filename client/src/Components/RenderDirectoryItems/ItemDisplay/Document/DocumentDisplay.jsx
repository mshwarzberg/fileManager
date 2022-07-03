import React from "react";
import DisplayMiscellaneous from "../../../Tools/DisplayMiscellaneous";

export default function DocumentDisplay({ viewItem, setViewItem }) {
  return (
    <div className="display--block" id="document--body">
      <DisplayMiscellaneous
        viewItem={viewItem}
        setViewItem={setViewItem}
        confirmExit={() => {}}
      />
      <div className="container">{viewItem.property}</div>
    </div>
  );
}
