import React, { useState } from "react";
import ContextMenu from "./ContextMenu/ContextMenu";
import CustomTitle from "./CustomTitle";
import useContainWithinScreen from "../../Hooks/useContainWithinScreen";
import Properties from "./ContextMenu/Functions/Properties";

export default function GeneralUI() {
  const [contextMenu, setContextMenu] = useState({});
  const [title, setTitle] = useState({});
  const [showProperties, setShowProperties] = useState(false);

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
