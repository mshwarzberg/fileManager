import transferItems from "../Components/Tools/ContextMenu/FS and OS Functions/TransferItems";

export default function TransferFunction(
  sources,
  destination,
  mode,
  currentDirectory,
  setDirectoryItems
) {
  for (const index in sources) {
    const source = sources[index]["info"];
    transferItems(source, mode, destination).then(() => {
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
    });
  }
}
