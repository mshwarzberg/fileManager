import { useEffect, useContext } from "react";
import newDirectory from "../Helpers/FS and OS/NewDirectory";
import { GeneralContext } from "../Components/Main/Main.jsx";
import clickOnItem from "../Helpers/ClickOnItem";
import randomID from "../Helpers/RandomID";
import { handleTransfer } from "../Helpers/FS and OS/HandleTransfer";

export default function useShortcuts(
  [selectedItems, setSelectedItems = () => {}],
  [clipboard, setClipboard = () => {}],
  [popup, setPopup = () => {}],
  setReload
) {
  const {
    state,
    dispatch,
    directoryItems,
    setRenameItem,
    setViews,
    settings,
    views,
  } = useContext(GeneralContext);

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
      if (e.key !== "F4") {
        e.preventDefault();
      }
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
          case "r":
            setReload((prevReload) => !prevReload);
            break;
          case "x":
          case "c":
            setClipboard({
              source: state.currentDirectory,
              mode: e.key === "c" ? "copy" : "move",
              info: selectedItems.map((path) => {
                const element = document.getElementById(path);
                const info = JSON.parse(element.dataset.info || "{}");
                return info;
              }),
            });
            break;
          case "a":
            const pageItems = [...document.getElementsByClassName("page-item")];
            setSelectedItems(pageItems.map((block) => block.id));
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
            setRenameItem({
              path: selectedItems[0].info.path,
              element: selectedItems[0].element,
            });
          }
          break;
        case "Delete":
          break;
        case "ArrowRight":
        case "ArrowLeft":
          if (!selectedItems[0]) {
            return setSelectedItems([directoryItems[0].path]);
          }
          const lastSelectedInArray = selectedItems[selectedItems.length - 1];
          let indexOfSelectedItem = directoryItems
            .map((directoryItem) => {
              return directoryItem.path;
            })
            .indexOf(lastSelectedInArray);

          if (e.key === "ArrowRight") {
            indexOfSelectedItem++;
            indexOfSelectedItem = Math.min(
              directoryItems.length - 1,
              indexOfSelectedItem
            );
          } else {
            indexOfSelectedItem--;
            indexOfSelectedItem = Math.max(0, indexOfSelectedItem);
          }

          setSelectedItems([directoryItems[indexOfSelectedItem].path]);
          break;
        case "Enter":
          selectedItems.map((path) => {
            const element = document.getElementById(path);
            const info = JSON.parse(element.dataset.info || "{}");
            clickOnItem(info, dispatch);
            return "";
          });
          break;
        case "Escape":
          setPopup({});
          break;
        case "F12":
          // document.getElementById("settings-button").click();
          break;
        default:
          return;
      }
    }
    function handleIconSizeChange(e) {
      if (e.ctrlKey || e.shiftKey) {
        setViews((prevViews) => {
          const { pageView, iconSize } = prevViews;
          const scrollingUp = e.deltaY < 0;
          const scrollingDown = e.deltaY > 0;

          const views = ["list", "details", "tiles", "content"];

          if (Math.max(iconSize - 0.5, 6) === 6 && scrollingDown) {
            return {
              ...prevViews,
              pageView:
                pageView === "content"
                  ? pageView
                  : views[views.indexOf(pageView) + 1 || 0],
            };
          } else {
            return {
              ...prevViews,
              pageView:
                pageView === "list"
                  ? "icon"
                  : views[views.indexOf(pageView) - 1] || "icon",
              ...((pageView === "list" || pageView === "icon") && {
                iconSize: scrollingUp
                  ? Math.min(iconSize + 0.5, 16)
                  : Math.max(iconSize - 0.5, 6),
              }),
            };
          }
        });
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("wheel", handleIconSizeChange);
    return () => {
      window.removeEventListener("wheel", handleIconSizeChange);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedItems, clipboard, popup, settings, views]);
}
