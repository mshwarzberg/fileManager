import { useState, useEffect } from "react";

export default function CornerInfo({
  directoryContent,
  clipboard,
  selectedItems,
}) {
  const [cornerMessage, setCornerMessage] = useState("");

  useEffect(() => {
    let message = `${directoryContent.length} total items`;
    let clipboardMessage;
    if (selectedItems.length === 1) {
      message += " (1 selected)";
    } else if (selectedItems.length > 1) {
      message += ` (${selectedItems.length} selected) `;
    }
    if (clipboard.mode) {
      if (clipboard.mode === "copy") {
        clipboardMessage = `, ${clipboard.info?.length} items copied`;
      } else {
        clipboardMessage = `, ${clipboard.info?.length} items cut`;
      }
    } else {
      clipboardMessage = "";
    }
    setCornerMessage(message + clipboardMessage);
  }, [clipboard, selectedItems, directoryContent.length]);

  return (
    <div id="corner-message-container">
      <h1 id="directory-items-count">{cornerMessage}</h1>
    </div>
  );
}
