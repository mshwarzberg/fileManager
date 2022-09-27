import { useEffect, useContext } from "react";
import newDirectory from "../Helpers/FS and OS/NewDirectory";
import { DirectoryContext } from "../Components/Main/App";
import clickOnItem from "../Helpers/ClickOnItem";

const { execFileSync } = window.require("child_process");
export default function useShortcuts(
  itemsSelected,
  setClipboardData,
  clipboardData
) {
  const {
    state,
    dispatch,
    lastSelected,
    setLastSelected,
    setItemsSelected,
    directoryItems,
    setRenameItem,
  } = useContext(DirectoryContext);

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
            setClipboardData({
              mode: e.key === "c" ? "copy" : "cut",
              info: itemsSelected.map((itemSelected) => {
                return itemSelected.info;
              }),
            });
            break;
          default:
            return;
        }
        return;
      }
      switch (e.key) {
        case "F2":
          if (itemsSelected[0]) {
            setRenameItem(itemsSelected[0].info.name);
          }
          break;
        case "Delete":
          try {
            execFileSync("recycle.exe", [
              ...itemsSelected
                .map((itemSelected) => itemSelected.info.path)
                .filter((item) => item && item),
            ]);
          } catch (e) {
            console.log(e);
          }
          break;
        case "ArrowRight":
        case "ArrowLeft":
          const lastSelectedInArray =
            itemsSelected[itemsSelected.length - 1].info;
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
              setItemsSelected([
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
          itemsSelected.map((item) => {
            clickOnItem(item.info, dispatch);
          });
          break;
        default:
          return;
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [itemsSelected, clipboardData]);
}
