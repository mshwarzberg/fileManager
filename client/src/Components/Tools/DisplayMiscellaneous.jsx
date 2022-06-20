import React from "react";
import Close from "../../Assets/images/close.png";

export default function DisplayMiscellaneous(props) {
  const { viewItem, setViewItem, confirmExit } = props;

  return (
    <>
      {document.fullscreenElement && viewItem.type !== "video" && (
        <h1 id="display--name">{viewItem.path}</h1>
      )}

      <div
        id="display--close"
        onClick={() => {
          if (typeof confirmExit === "function") {
            confirmExit();
          }
          if (viewItem.type === "video") {
            fetch("/api/loadfiles/closevideo");
          }
          URL.revokeObjectURL(viewItem.property);
          setViewItem({
            type: null,
            property: null,
            index: null,
            name: null,
            path: null,
          });
        }}
      >
        <img
          src={localStorage.getItem("close") || Close}
          alt="close"
          draggable={false}
        />
      </div>
    </>
  );
}
