import { useContext, useEffect } from "react";
import { GeneralContext } from "../../Main/Main.jsx";
import ArchivePopup from "./ArchivePopup.jsx";

const { exec } = window.require("child_process");

export default function Archive({
  contextMenu,
  subMenuClassNames,
  selectedItems,
}) {
  const {
    info: { filetype, path, fileextension },
  } = contextMenu;

  const {
    directoryState: { currentDirectory, currentDirectoryName },
    dispatch,
    setPopup,
    views: { appTheme },
  } = useContext(GeneralContext);

  useEffect(() => {
    if (currentDirectory !== "Trash") {
      try {
        let newName = currentDirectory.slice(0, currentDirectory.length - 1);
        newName = newName.slice(newName.lastIndexOf("/") + 1, Infinity);
        dispatch({ type: "setName", value: newName });
      } catch {}
    }
  }, [currentDirectory]);

  const sevenZipPath = ".\\resources\\7zip\\7za.exe";

  return (
    <div className={subMenuClassNames()}>
      <button
        onClick={() => {
          setPopup({
            body: <ArchivePopup selectedItems={selectedItems} />,
            ok: (
              <button id="ok-settings" className={`button-${appTheme}`}>
                OK
              </button>
            ),
            cancel: (
              <button
                className={`button-${appTheme}`}
                onClick={() => {
                  setPopup({});
                }}
              >
                Cancel
              </button>
            ),
            popupLabel: <h1 id="popup-label">Archive</h1>,
          });
          // exec(
          //   `${sevenZipPath} a "${
          //     currentDirectory + currentDirectoryName
          //   }.zip" "${selectedItems.join('" "')}"`,
          //   (e, d) => {
          //     if (e) return console.log(e);
          //     console.log(d);
          //   }
          // );
        }}
      >
        Add To Archive
      </button>
      {filetype === "archive" && (
        <button
          onMouseUp={() => {
            // exec(
            //   `${sevenZipPath} x "${path}" -y -o"${path.slice(
            //     0,
            //     path.length - (fileextension?.length || 0)
            //   )}"`,
            //   (e, d) => {
            //     console.log(e, d);
            //   }
            // );
          }}
        >
          Extract Here
        </button>
      )}
    </div>
  );
}
