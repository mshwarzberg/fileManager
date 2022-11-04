export default function sortBy(setDirectoryItems, method, ascending) {
  method = method.toLowerCase();
  if (method === "date") {
    method = "modified";
  } else if (method === "type") {
    method = "fileextension";
  }
  setDirectoryItems((prevItems) => {
    const newSort = prevItems
      .sort((a, b) => {
        try {
          return a[method].localeCompare(b[method]);
        } catch (error) {
          return 0;
        }
      })
      .sort((a, b) => {
        if (parseInt(a[method])) {
          return parseInt(a[method]) - parseInt(b[method]);
        }
        return 0;
      });
    if (ascending) {
      newSort.reverse();
    }
    return newSort;
  });

  setDirectoryItems((prevItems) =>
    prevItems.sort((a) => {
      if (a.isDirectory) {
        return -1;
      }
      return 0;
    })
  );
}
