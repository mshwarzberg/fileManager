import { useState, useEffect } from "react";

export default function CornerInfo({
  directoryItems,
  clipboard,
  selectedItems,
}) {
  return (
    <div id="corner-message-container">
      <h1 id="directory-items-count">
        {directoryItems.length} total items{" "}
        {selectedItems.length === 1 && `(1 selected)`}
        {selectedItems.length > 1 && `(${selectedItems.length} selected) `}
      </h1>
    </div>
  );
}
