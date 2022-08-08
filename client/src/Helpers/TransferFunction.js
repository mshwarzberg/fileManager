export default function TransferFunction(
  metadata,
  destination,
  mode,
  currentDirectory,
  setDirectoryItems
) {
  for (const index in metadata) {
    fetch("/api/manage/transfer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: metadata[index].path,
        mode: mode,
        destination: destination,
        isDirectory: metadata[index].isDirectory,
      }),
    })
      .then((res) => {
        if (res.status === 409 || res.status === 500) {
          return;
        }
        if (currentDirectory === destination) {
          setDirectoryItems((prevItems) => [
            ...prevItems,
            {
              ...metadata[index],
              path: currentDirectory + metadata[index].name,
            },
          ]);
        } else if (currentDirectory !== destination && mode === "cut") {
          setDirectoryItems((prevItems) => {
            return prevItems.map((prevItem) => {
              if (prevItem.name === metadata[index].name) {
                return {};
              }
              return prevItem;
            });
          });
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }
}
