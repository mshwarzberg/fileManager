import React, { useState } from "react";
import Close from "../../Assets/images/close.png";
import alerticon from "../../Assets/images/alert.png";
import useScreenDimensions from "../../Hooks/useScreenDimensions";
import Back from "../../Assets/images/navigate-backwards.png";
import Forward from "../../Assets/images/navigate-forwards.png";
import SaveDocument from "./Document/SaveDocument";

export default function DisplayControlsAndNavigation(props) {
  const {
    fullscreen,
    viewItem,
    setViewItem,
    setFullscreen,
    isNavigating,
    changeFolderOrViewFiles,
    openDocument,
  } = props;

  const { width } = useScreenDimensions();

  const [confirmExit, setConfirmExit] = useState();

  return (
    <>
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
                });
              }}
            >
              Discard changes
            </button>
            <SaveDocument
              viewItem={viewItem}
              id="right"
              openDocument={openDocument?.textContent}
              setViewItem={setViewItem}
              setConfirmExit={setConfirmExit}
              setFullscreen={setFullscreen}
              text='Save and exit'
            />
          </div>
        </div>
      )}

      {!fullscreen && isNavigating.visible && (
        <div id="navigating-indicator">
          <img
            src={alerticon}
            alt=""
            title={`Press "Tab" to toggle the visibility of this message`}
          />
          <h1 id="navigating-indicator-popup">
            {isNavigating.value
              ? `Navigation Enabled: "CapsLock" to disable`
              : `Navigation Disabled: "CapsLock" to enable`}
          </h1>
        </div>
      )}
      <img
        src={Close}
        alt="close"
        className="viewitem--close"
        onClick={() => {
          if (viewItem.property !== openDocument?.textContent && openDocument) {
            return setConfirmExit(true);
          }
          setFullscreen(false);
          URL.revokeObjectURL(viewItem.property);
          setViewItem({
            type: null,
            property: null,
            index: null,
            name: null,
          });
        }}
        draggable={false}
      />
      {width < 900 && (
        <>
          <img
            id="button--backwards"
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
            id="button--forwards"
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
    </>
  );
}
