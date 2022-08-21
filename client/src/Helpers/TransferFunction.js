export default function TransferFunction(
  sources,
  destination,
  mode,
  currentDirectory,
  setDirectoryItems
) {
  for (const index in sources) {
    const source = sources[index]["info"];
    fetch("/api/manage/transfer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: source,
        name: source.name,
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
              ...source,
              path: currentDirectory,
            },
          ]);
        } else if (currentDirectory !== destination && mode === "cut") {
          setDirectoryItems((prevItems) => {
            return prevItems
              .map((prevItem) => {
                if (prevItem.name === source.name) {
                  return {};
                }
                return prevItem;
              })
              .filter((item) => {
                return item.name && item;
              });
          });
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }
}
