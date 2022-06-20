import React, { useState } from "react";
import ContextMenu from "./ContextMenu/ContextMenu";
import CustomTitle from "./CustomTitle";
import useContainWithinScreen from "../../Hooks/useContainWithinScreen";

export default function GeneralUI() {
  const [contextMenu, setContextMenu] = useState({});
  const [title, setTitle] = useState({});

  useContainWithinScreen("#menu", setContextMenu, [
    contextMenu.x,
    contextMenu.y,
  ]);
  useContainWithinScreen("#custom-title", setTitle, [title.title]);

  return (
    <>
      <ContextMenu contextMenu={contextMenu} setContextMenu={setContextMenu} />
      <CustomTitle
        contextMenu={contextMenu}
        title={title}
        setTitle={setTitle}
      />
    </>
  );
}
