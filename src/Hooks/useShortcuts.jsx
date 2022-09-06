import { useEffect, useContext } from "react";
import newDirectory from "../Helpers/FS and OS/NewDirectory";
import { DirectoryContext } from "../Components/Main/App";

export default function useShortcuts(
  itemsSelected,
  setClipboardData,
  clipboardData
) {
  const { state } = useContext(DirectoryContext);

  useEffect(() => {
    function navigateDirectories(e) {
      if (e.button === 3) {
        document.getElementById("navbar-backwards").click();
      } else if (e.button === 4) {
        document.getElementById("navbar-forwards").click();
      }
    }
    document.addEventListener("mousedown", navigateDirectories);
    return () => {
      document.removeEventListener("mousedown", navigateDirectories);
    };
  }, []);
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.repeat) {
        return;
      }
      if (e.ctrlKey && e.shiftKey) {
        if (e.key === "N") {
          newDirectory(state);
        }
      }
      if (e.ctrlKey) {
        if (e.key === "c" || e.key === "x") {
          setClipboardData({
            mode: e.key === "c" ? "copy" : "cut",
            info: itemsSelected.map((itemSelected) => {
              return itemSelected.info;
            }),
          });
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [itemsSelected, clipboardData]);
}
