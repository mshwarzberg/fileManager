import React, { useState } from "react";
import ContextMenu from "./ContextMenu/ContextMenu";
import CustomTitle from "./CustomTitle";
import useContainWithinScreen from "../../Hooks/useContainWithinScreen";
import Properties from "./ContextMenu/Functions/Properties";
// import Confirm from "./Popups/Confirm";
// import Alert from "./Popups/Alert";
// import Prompt from "./Popups/Prompt";

export default function GeneralUI() {
  const [contextMenu, setContextMenu] = useState({});
  const [title, setTitle] = useState({});
  const [showProperties, setShowProperties] = useState(false);
  // const [popups, setPopups] = useState();

  useContainWithinScreen("#menu", setContextMenu, [
    contextMenu.x,
    contextMenu.y,
  ]);
  useContainWithinScreen("#custom-title", setTitle, [title.title]);

  return (
    <>
      <ContextMenu
        contextMenu={contextMenu}
        setContextMenu={setContextMenu}
        setShowProperties={setShowProperties}
      />
      <CustomTitle
        contextMenu={contextMenu}
        title={title}
        setTitle={setTitle}
      />
      {showProperties && (
        <Properties
          contextMenu={contextMenu}
          setContextMenu={setContextMenu}
          showProperties={showProperties}
          setShowProperties={setShowProperties}
        />
      )}
    </>
  );
}
