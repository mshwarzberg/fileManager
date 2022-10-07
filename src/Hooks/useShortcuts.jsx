import { useEffect, useContext } from "react";
import newDirectory from "../Helpers/FS and OS/NewDirectory";
import { DirectoryContext } from "../Components/Main/App";
import clickOnItem from "../Helpers/ClickOnItem";

const { execFileSync } = window.require("child_process");
export default function useShortcuts(
  selectedItems,
  setClipboardData,
  clipboardData,
  setSelectedItems
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
            setClipboardData({
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
          try {
            execFileSync("recycle.exe", [
              ...selectedItems
                .map((itemSelected) => itemSelected.info.path)
                .filter((item) => item && item),
            ]);
          } catch (e) {
            console.log(e);
          }
          break;
        case "ArrowRight":
        case "ArrowLeft":
          if (!selectedItems[0]) {
            return setSelectedItems([
              {
                element: document.getElementById(
                  directoryItems[0].location + directoryItems[0].name
                ),
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
        default:
          return;
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedItems, clipboardData]);
}
