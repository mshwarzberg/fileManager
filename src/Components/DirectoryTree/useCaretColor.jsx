import { useState, useEffect } from "react";

import rightCaretImageWhite from "../../Images/right-caret-white.png";
import rightCaretImageBlack from "../../Images/right-caret-black.png";

export function handleMouse(e, setCaretColor, isDirectoryCurrent) {
  const isRelatedDirectoryButton = [
    ...(e.relatedTarget?.classList || []),
  ].includes("child-directory");
  if (e.type === "mousemove") {
    setCaretColor(rightCaretImageBlack);
  } else if (!isRelatedDirectoryButton && !isDirectoryCurrent) {
    setCaretColor(rightCaretImageWhite);
  }
}

export default function useCaretColor(isCurrentDirectory) {
  const [caretColor, setCaretColor] = useState(rightCaretImageWhite);

  useEffect(() => {
    if (isCurrentDirectory) {
      setCaretColor(rightCaretImageBlack);
    }
  }, [isCurrentDirectory]);

  return { caretColor, setCaretColor };
}
