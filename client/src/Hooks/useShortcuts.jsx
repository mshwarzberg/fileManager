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
      switch (e.ctrlKey) {
        case true:
          switch (e.key) {
            case "a":
              const elements = document.getElementsByClassName("cover-block");
              const infoArray = [];
              for (const element of elements) {
                const info = JSON.parse(element.dataset.info || "{}");
                infoArray.push(info);
              }
              setItemsSelected(infoArray);
              return;
            case "c":
              setClipboardData({
                source: itemsSelected,
                mode: "copy",
              });
            case "x":
              setClipboardData({
                source: itemsSelected,
                mode: "cut",
              });
            case "v":
              console.log(clipboardData);
            // if (clipboardData.source) {
            //   PasteFunction(
            //     clipboardData,
            //     state.currentDirectory,
            //     clipboardData.mode,
            //     state.currentDirectory,
            //     directoryItems,
            //     {
            //       setAlert: setAlert,
            //       setClipboardData: setClipboardData,
            //       setDirectoryItems: setDirectoryItems,
            //       setConfirm: setConfirm,
            //       setContextMenu: setContextMenu,
            //     }
            //   );
            // }
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
  }, []);
}
