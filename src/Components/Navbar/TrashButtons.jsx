import { restoreFromTrash } from "../../Helpers/FS and OS/HandleTrash";

const fs = window.require("fs");

export default function TrashButtons({
  setPopup,
  directoryItems,
  setDirectoryItems,
}) {
  return (
    <>
      <button
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
        onClick={() => {
          const trashedItems = JSON.parse(localStorage.getItem("trash")) || [];
          setPopup({
            show: true,
            body: (
              <div id="body">
                Deleted items cannot be recovered. Are you sure you want to
                delete these {trashedItems.length} items?
              </div>
            ),
            ok: (
              <button
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
