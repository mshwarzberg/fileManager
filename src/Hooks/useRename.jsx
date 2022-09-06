import { useContext, useEffect } from "react";
import { DirectoryContext } from "../Components/Main/App";

const fs = window.require("fs");

export default function useRename() {
  const { rename, setRename, setDirectoryItems, state } =
    useContext(DirectoryContext);

  useEffect(() => {
    function handleRename() {
      document.getSelection().removeAllRanges();
      let oldPath, newPath;
      oldPath = rename.info.path;
      newPath =
        oldPath.slice(0, oldPath.length - rename.info.name.length) +
        rename.element.innerHTML;
      fs.renameSync(oldPath, newPath);

      setRename({});
    }

    function submitOnEnter(e) {
      if (e.key === "Enter") {
        e.preventDefault();
        rename.element.blur();
      }
    }

    if (rename.element) {
      rename.element.focus();
      const range = new Range();
      range.setStart(rename.element.firstChild, 0);
      range.setEnd(rename.element.firstChild, rename.endRange);
      document.getSelection().removeAllRanges();
      document.getSelection().addRange(range);

      rename.element.addEventListener("blur", handleRename);
      rename.element.addEventListener("keydown", submitOnEnter);

      return () => {
        rename.element.removeEventListener("keydown", submitOnEnter);
        rename.element.removeEventListener("blur", handleRename);
      };
    }
  }, [rename]);
}
