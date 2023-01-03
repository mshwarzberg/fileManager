import { useContext, useEffect } from "react";
import { GeneralContext } from "../../Main/Main.jsx";
import ArchivePopup from "./ArchivePopup.jsx";

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

  return (
    <div className={subMenuClassNames()}>
      <button
        onClick={() => {
          setPopup({
            body: <ArchivePopup selectedItems={selectedItems} />,
            ok: (
              <button id="ok-archive" className={`button-${appTheme}`}>
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
            popupLabel: (
              <h1 id="popup-label">Archive ({selectedItems.length}) items</h1>
            ),
          });
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
