export default function TransferFunction(
  source,
  destination,
  mode,
  currentDirectory,
  setDirectoryItems
) {
  for (const index in source) {
    fetch("/api/manage/transfer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: source[index],
        name: source[index].name,
        mode: mode,
        destination: destination,
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
              ...source[index],
              path: currentDirectory,
            },
          ]);
        } else if (currentDirectory !== destination && mode === "cut") {
          setDirectoryItems((prevItems) => {
            return prevItems.map((prevItem) => {
              if (prevItem.name === source[index].name) {
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
