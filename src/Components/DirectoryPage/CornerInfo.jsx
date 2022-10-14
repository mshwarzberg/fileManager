import { useState, useEffect } from "react";

export default function CornerInfo({
  directoryItems,
  clipboard,
  selectedItems,
}) {
  const [clipboardMessage, setClipboardMessage] = useState("");

  useEffect(() => {
    if (clipboard.info) {
      setClipboardMessage(
        `${clipboard.info.length} items ${
          clipboard.mode === "copy" ? "copied" : "cut"
        }`
      );
    }
  }, [clipboard]);

  // useEffect(() => {
  //   let timeout = setTimeout(() => {
  //     setClipboardMessage("");
  //   }, 10000);
  //   return () => {
  //     clearTimeout(timeout);
  //   };
  // }, [clipboardMessage]);

  return (
    <div id="corner-message-container">
      <h1 id="directory-items-count">
        {directoryItems.length} total items{" "}
        {selectedItems.length === 1 && `(1 selected)`}
        {selectedItems.length > 1 && `(${selectedItems.length} selected) `}
      </h1>
      {/* <h1 id="clipboard-message">{clipboardMessage}</h1> */}
    </div>
  );
}
