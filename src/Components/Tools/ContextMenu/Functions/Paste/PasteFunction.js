import TransferFunction from "../../../../../Helpers/TransferFunction";
import MoveToTrash from "../../FS and OS Functions/MoveToTrash";
import checkForDuplicates from "../../FS and OS Functions/CheckForDuplicates";
export default function PasteFunction(
  source,
  destination,
  mode,
  currentDirectory,
  allFunctions
) {
  const { setDirectoryItems, setPopup, setContextMenu, setClipboardData } =
    allFunctions;

  checkForDuplicates(
    destination,
    source.map((item) => {
      return item.info.name;
    })
  ).then((duplicates) => {
    if (duplicates[0]) {
      setPopup({
        type: "confirm",
        dialog: (
          <>
            Do you want to replace&nbsp;
            {duplicates.length > 1
              ? `these ${duplicates.length} items`
              : "this item"}
            {
              <div id="list-of-duplicates-container">
                {duplicates.map((duplicate) => {
                  return (
                    <p key={duplicate} className="list-of-duplicates">
                      {duplicate}
                    </p>
                  );
                })}
              </div>
            }
            <p
              id="show-duplicates"
              onMouseEnter={() => {
                document.getElementById(
                  "list-of-duplicates-container"
                ).style.display = "block";
              }}
              onMouseLeave={() => {
                document.getElementById(
                  "list-of-duplicates-container"
                ).style.display = "none";
              }}
              onWheel={(e) => {
                const listOfDupes = document.getElementById(
                  "list-of-duplicates-container"
                );
                listOfDupes.scroll(
                  0,
                  listOfDupes.scrollTop + (e.deltaY > 0 ? 20 : -20)
                );
              }}
            >
              &nbsp;?
            </p>
          </>
        ),
        confirmFunction: () => {
          const deleteItems = duplicates.map((duplicate) => {
            return currentDirectory + duplicate;
          });
          MoveToTrash(deleteItems)
            .then(() => {
              setDirectoryItems((prevItems) => {
                return prevItems
                  .map((prevItem) => {
                    if (deleteItems.includes(prevItem.path + prevItem.name)) {
                      return {};
                    }
                    return prevItem;
                  })
                  .filter((item) => {
                    return item.name && item;
                  });
              });
              TransferFunction(
                source,
                destination,
                mode,
                currentDirectory,
                setDirectoryItems
              );
            })
            .catch((e) => {
              setPopup({
                type: "alert",
                dialog: e,
              });
            });
        },
        cancelFunction: () => {
          const itemsToTransfer = [];
          for (const item of source) {
            if (!duplicates.includes(item.info.name)) {
              itemsToTransfer.push(item);
            }
          }
          TransferFunction(
            itemsToTransfer,
            destination,
            mode,
            currentDirectory,
            setDirectoryItems
          );
          if (mode === "cut") {
            setClipboardData({});
          }
          setContextMenu({});
        },
        cancelText: "Skip",
        confirmText: "Replace",
      });
    } else {
      TransferFunction(
        source,
        destination,
        mode,
        currentDirectory,
        setDirectoryItems
      );
      if (mode === "cut") {
        setClipboardData({});
      }
    }
  });
}
