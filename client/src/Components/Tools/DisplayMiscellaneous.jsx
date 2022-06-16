import React from "react";
import Close from "../../Assets/images/close.png";
import Back from "../../Assets/images/navigate-backwards.png";
import Forward from "../../Assets/images/navigate-forwards.png";

export default function DisplayMiscellaneous(props) {
  const {
    fullscreen,
    viewItem,
    setViewItem,
    setFullscreen,
    changeFolderOrViewFiles,
    confirmExit,
  } = props;

  return (
    <>
      {!fullscreen && viewItem.type !== "video" && (
        <h1 id="display--name">{viewItem.path}</h1>
      )}
      {window.innerWidth < 900 && (
        <>
          <img
            id="display--nav-back"
            src={Back}
            alt="back"
            onClick={() => {
              changeFolderOrViewFiles(
                viewItem.type,
                viewItem.name,
                viewItem.index,
                "backwards"
              );
            }}
          />
          <img
            id="display--nav-forwards"
            src={Forward}
            alt="forward"
            onClick={() => {
              changeFolderOrViewFiles(
                viewItem.type,
                viewItem.name,
                viewItem.index,
                "forwards"
              );
            }}
          />
        </>
      )}
      <img
        src={localStorage.getItem("close") || Close}
        alt="close"
        id="display--close"
        onClick={() => {
          if (typeof confirmExit === "function") {
            confirmExit();
          }
          if (viewItem.type === "video") {
            fetch("/api/loadfiles/closevideo");
          }
          setFullscreen(false);
          URL.revokeObjectURL(viewItem.property);
          setViewItem({
            type: null,
            property: null,
            index: null,
            name: null,
            path: null,
          });
        }}
        draggable={false}
      />
    </>
  );
}
