import TransferFunction from "../../../../../Helpers/TransferFunction";
import { foundInArray } from "../../../../../Helpers/SearchArray";

export default function PasteFunction(
  source,
  destination,
  mode,
  currentDirectory,
  currentDirectoryItems,
  allFunctions
) {
  const {
    setDirectoryItems,
    setConfirm,
    setAlert,
    setContextMenu,
    setClipboardData,
  } = allFunctions;

  const duplicates = [];
  for (const item of source) {
    if (foundInArray(currentDirectoryItems, item.name, "name")) {
      duplicates.push(item.name);
    }
  }
  if (duplicates[0]) {
    setConfirm({
      show: true,
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
        for (const index in deleteItems) {
          fetch("/api/manage/delete", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              paths: [deleteItems[index]],
            }),
          }).then(async (res) => {
            const response = await res.json();
            if (response.err) {
              setAlert({
                show: true,
                dialog: "Error occurred while deleting the item(s)",
              });
              setContextMenu({});
            } else {
              setDirectoryItems((prevItems) => {
                return prevItems.map((prevItem) => {
                  if (deleteItems[index] === prevItem.path + prevItem.name) {
                    return {};
                  }
                  return prevItem;
                }).filter((item) => {
                  return item.name && item;
                });;
              })
              TransferFunction(
                [source[index]],
                destination,
                mode,
                currentDirectory,
                setDirectoryItems
              );
            }
          });
        }
      },
      cancelFunction: () => {
        const itemsToTransfer = [];
        for (const item of source) {
          if (!duplicates.includes(item.name)) {
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
  return "hello";
}
