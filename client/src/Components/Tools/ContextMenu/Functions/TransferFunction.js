export default function TransferFunction(
  clipboardData,
  destination,
  contextMenu,
  setDirectoryItems,
  setClipboardData,
  currentDirectory
) {
  fetch("/api/manage/transfer", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      source: clipboardData.source,
      mode: clipboardData.mode,
      isDirectory: clipboardData.isSourceDirectory,
      destination: destination,
    }),
  })
    .then((res) => {
      if (res.status === 409) {
        console.log(res);
        return;
      } else if (res.status === 500) {
        alert("Error occurred");
        return;
      }
      if (contextMenu) {
        if (currentDirectory === contextMenu.info.destination) {
          setDirectoryItems((prevItems) => [
            ...prevItems,
            {
              ...clipboardData.metadata,
              path: currentDirectory + clipboardData.metadata.name,
            },
          ]);
        } else if (
          currentDirectory !== contextMenu.info.destination &&
          clipboardData.mode === "cut"
        ) {
          setDirectoryItems((prevItems) => {
            return prevItems.map((prevItem) => {
              if (prevItem.name === clipboardData.metadata.name) {
                return {};
              }
              return prevItem;
            });
          });
        }
        if (clipboardData.mode === "cut") {
          setClipboardData({});
        }
      } else {
        setDirectoryItems((prevItems) => {
          return prevItems.map((prevItem) => {
            if (prevItem.name === clipboardData.metadata.name) {
              return {};
            }
            return prevItem;
          });
        });
      }
    })
    .catch((e) => {});
}
