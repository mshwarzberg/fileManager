import { restoreFromTrash } from "../../Helpers/FS and OS/HandleTrash";
import { useContext } from "react";
import { GeneralContext } from "../Main/App";

const fs = window.require("fs");

export default function TrashButtons({
  setPopup,
  directoryItems,
  setDirectoryItems,
}) {
  const {
    settings: { appTheme },
  } = useContext(GeneralContext);

  return (
    <>
      <button
        className={`button-${appTheme}`}
        onClick={() => {
          setDirectoryItems(
            restoreFromTrash(JSON.parse(localStorage.getItem("trash")) || [])
          );
        }}
        disabled={directoryItems.length === 0}
      >
        Restore All
      </button>
      <button
        className={`button-${appTheme}`}
        onClick={() => {
          const trashedItems = JSON.parse(localStorage.getItem("trash")) || [];
          setPopup({
            body: (
              <div id="body">
                <h1 id="description">
                  Deleted items cannot be recovered. Are you sure you want to
                  delete these {trashedItems.length} items?
                </h1>
              </div>
            ),
            ok: (
              <button
                className={`button-${appTheme}`}
                onClick={() => {
                  for (const trashedItem of trashedItems) {
                    if (trashedItem.isDirectory) {
                      fs.rmdirSync(trashedItem.path, { recursive: true });
                    } else {
                      fs.unlinkSync(trashedItem.path);
                    }
                  }
                  localStorage.setItem("trash", "[]");
                  setDirectoryItems([]);
                  setPopup({});
                }}
              >
                Delete
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
          });
        }}
        disabled={directoryItems.length === 0}
      >
        Empty Trash
      </button>
    </>
  );
}
