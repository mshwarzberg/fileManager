import React, { useState } from "react";
import Close from "../../Assets/images/close.png";
import alerticon from "../../Assets/images/alert.png";
import useScreenDimensions from "../../Hooks/useScreenDimensions";
import Back from "../../Assets/images/navigate-backwards.png";
import Forward from "../../Assets/images/navigate-forwards.png";
import SaveDocument from "../Tools/SaveDocument";

export default function DisplayMiscellaneous(props) {
  const {
    fullscreen,
    viewItem,
    setViewItem,
    setFullscreen,
    isNavigating,
    changeFolderOrViewFiles,
    currentDocument,
  } = props;

  const { width } = useScreenDimensions();

  const [confirmExit, setConfirmExit] = useState();

  return (
    <>
      {!fullscreen && viewItem.type !== "video" && (
        <h1 id="display--name">{viewItem.path}</h1>
      )}
      {confirmExit && (
        <div id="confirmexit--body">
          <div id="confirmexit--popup">
            <p
              onClick={() => {
                setConfirmExit();
              }}
            >
              x
            </p>
            <h1>You have unsaved changes. Are you sure you want to Exit?</h1>
            <button
              id="left"
              onClick={() => {
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
            >
              Discard changes
            </button>
            <SaveDocument
              viewItem={viewItem}
              id="right"
              currentDocumentText={currentDocument?.textContent}
              setViewItem={setViewItem}
              setConfirmExit={setConfirmExit}
              setFullscreen={setFullscreen}
              text="Save and exit"
            />
          </div>
        </div>
      )}
      {width < 900 && (
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
      {!fullscreen && isNavigating.visible && viewItem.type !== "video" && (
        <div id="display--is-navigating">
          <img
            src={localStorage.getItem("alert") || alerticon}
            alt=""
            title={`Press "Tab" to toggle the visibility of this message`}
          />
          <h1 id="display--is-navigating-popup">
            {isNavigating.value
              ? `Navigation Enabled: "CapsLock" to disable`
              : `Navigation Disabled: "CapsLock" to enable`}
          </h1>
        </div>
      )}
      <img
        src={localStorage.getItem("close") || Close}
        alt="close"
        id="display--close"
        onClick={() => {
          if (viewItem.type === "video") {
            fetch("/api/loadfiles/closevideo");
          }
          if (
            viewItem.property !== currentDocument?.textContent &&
            viewItem.type === "document" &&
            currentDocument
          ) {
            return setConfirmExit(true);
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
