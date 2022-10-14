import { useEffect, useContext } from "react";
import newDirectory from "../Helpers/FS and OS/NewDirectory";
import { DirectoryContext } from "../Components/Main/App";
import clickOnItem from "../Helpers/ClickOnItem";
import { handleMoveToTrash } from "../Helpers/FS and OS/HandleTrash";
import randomID from "../Helpers/RandomID";
import { handleTransfer } from "../Helpers/FS and OS/HandleTransfer";

export default function useShortcuts(
  selectedItems,
  setClipboard,
  clipboard,
  setSelectedItems,
  setPopup,
  popup
) {
  const { state, dispatch, directoryItems, setRenameItem } =
    useContext(DirectoryContext);

  useEffect(() => {
    function navigateDirectories(e) {
      if (e.button === 3) {
        document.getElementById("navigate-back").click();
      } else if (e.button === 4) {
        document.getElementById("navigate-forwards").click();
      }
    }
    document.addEventListener("mousedown", navigateDirectories);
    return () => {
      document.removeEventListener("mousedown", navigateDirectories);
    };
  }, []);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.repeat && !e.key.includes("Arrow")) {
        return;
      }

      if (e.ctrlKey && e.shiftKey) {
        switch (e.key) {
          case "N":
            newDirectory(state);
            break;
          default:
            return;
        }
        return;
      }
      if (e.ctrlKey) {
        switch (e.key) {
          case "x":
          case "c":
            setClipboard({
              source: state.currentDirectory,
              mode: e.key === "c" ? "copy" : "cut",
              info: selectedItems.map((itemSelected) => {
                return itemSelected.info;
              }),
            });
            break;
          case "a":
            const pageBlocks = [
              ...document.getElementsByClassName("display-page-block"),
            ];
            setSelectedItems(
              pageBlocks.map((block) => ({
                element: block,
                info: JSON.parse(block.dataset.info || "{}"),
              }))
            );
            break;
          case "v":
            handleTransfer(
              state.currentDirectory,
              setPopup,
              clipboard,
              setClipboard
            );
            break;
          case "z":
            break;
          default:
            return;
        }
        return;
      }
      switch (e.key) {
        case "F2":
          if (selectedItems[0]) {
            setRenameItem(selectedItems[0].info.name);
          }
          break;
        case "Delete":
          handleMoveToTrash(
            selectedItems.map((item) => {
              const { info } = item;
              const id = "$" + randomID(10);
              return {
                ...info,
                name: id + info.fileextension,
                location: state.drive + "trash/",
                path: state.drive + "trash/" + id + info.fileextension,
                current: state.drive + "trash/" + id + info.fileextension,
                original: info.path,
                ...(info.size < 300000 && {
                  thumbPath: state.drive + "trash/" + id + info.fileextension,
                }),
              };
            }),
            state.drive
          );
          break;
        case "ArrowRight":
        case "ArrowLeft":
          if (!selectedItems[0]) {
            return setSelectedItems([
              {
                element: document.getElementById(directoryItems[0].path),
                info: directoryItems[0],
              },
            ]);
          }
          const lastSelectedInArray =
            selectedItems[selectedItems.length - 1].info;
          directoryItems.map((directoryItem, index) => {
            if (directoryItem.name === lastSelectedInArray.name) {
              if (e.key === "ArrowRight") {
                index++;
              } else {
                index--;
              }
              if (!directoryItems[index]) {
                return;
              }
              const { name, location } = directoryItems[index];
              setSelectedItems([
                {
                  element: document.getElementById(location + name),
                  info: directoryItems[index],
                },
              ]);
              document.getElementById(location + name).focus();
            }
          });
          break;
        case "Enter":
          e.preventDefault();
          selectedItems.map((item) => {
            clickOnItem(item.info, dispatch);
          });
          break;
        case "Escape":
          setPopup({});
          break;
        default:
          return;
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedItems, clipboard, popup]);
}
