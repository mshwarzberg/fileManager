import { useEffect, useContext } from "react";
import { GeneralContext } from "../Components/Main/App";
import PasteFunction from "../Components/Tools/ContextMenu/Functions/Paste/PasteFunction";

export default function useShortcuts(
  setClipboardData,
  setContextMenu,
  setConfirm,
  setAlert,
  clipboardData
) {
  const {
    setItemsSelected,
    itemsSelected,
    setDirectoryItems,
    directoryItems,
    state,
  } = useContext(GeneralContext);

  useEffect(() => {
    function handleKeyDown(e) {
      const blocks = document.getElementsByClassName("cover-block");
      switch (e.key) {
        case "Enter":
          if (itemsSelected[0]) {
            for (const item of itemsSelected) {
              fetch("/api/manage/open", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  path: item.info.path + item.info.name,
                }),
              });
            }
            break;
          }
        default:
          break;
      }
      switch (e.ctrlKey) {
        case true:
          switch (e.key) {
            case "a":
              const elements = document.getElementsByClassName("cover-block");
              setItemsSelected([]);
              for (const element of elements) {
                const info = JSON.parse(element.dataset.info || "{}");
                setItemsSelected((prevItems) => [
                  ...prevItems,
                  { info: info, element: element },
                ]);
              }
              return;
            case "c":
              for (const block of blocks) {
                block.parentElement.style.opacity = 1;
              }
              setClipboardData({
                source: itemsSelected,
                mode: "copy",
              });
              return;
            case "x":
              setClipboardData({
                source: itemsSelected,
                mode: "cut",
              });
              for (const block of blocks) {
                block.parentElement.style.opacity = 1;
                const info = JSON.parse(block.dataset.info || "{}");
                for (const selected of itemsSelected) {
                  if (selected.name === info.name) {
                    block.parentElement.style.opacity = 0.5;
                  }
                }
              }
              return;
            case "v":
              if (clipboardData.source) {
                PasteFunction(
                  clipboardData.source,
                  state.currentDirectory,
                  clipboardData.mode,
                  state.currentDirectory,
                  directoryItems,
                  {
                    setAlert: setAlert,
                    setClipboardData: setClipboardData,
                    setDirectoryItems: setDirectoryItems,
                    setConfirm: setConfirm,
                    setContextMenu: setContextMenu,
                  }
                );
              }
              return;
            default:
              return;
          }
        default:
          return;
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line
  }, [clipboardData, itemsSelected]);
}
