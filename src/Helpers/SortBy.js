export default function sortBy(setDirectoryItems, method, ascending) {
  if (method === "Name") {
    setDirectoryItems((prevItems) => {
      const newSort = prevItems.sort((a, b) => {
        if (parseInt(a.name)) {
          return parseInt(a.name) - parseInt(b.name);
        }
        return a.name.localeCompare(b.name);
      });
      if (ascending) {
        newSort.reverse();
      }
      return newSort;
    });
  }
  if (method === "Size") {
    setDirectoryItems((prevItems) => {
      const newSort = prevItems.sort((a, b) => {
        return b.size - a.size;
      });
      if (ascending) {
        newSort.reverse();
      }
      return newSort;
    });
  }
  if (method === "Date") {
    setDirectoryItems((prevItems) => {
      const newSort = prevItems.sort((a, b) => {
        return b.modified - a.modified;
      });
      if (ascending) {
        newSort.reverse();
      }
      return newSort;
    });
  }
  if (method === "Type") {
    setDirectoryItems((prevItems) => {
      const newSort = prevItems.sort((a, b) => {
        return a.fileextension?.localeCompare(b.fileextension);
      });
      if (ascending) {
        newSort.reverse();
      }
      return newSort;
    });
  }
  if (method === "Duration") {
    setDirectoryItems((prevItems) => {
      const newSort = prevItems.sort((a, b) => {
        return b.duration - a.duration;
      });
      if (ascending) {
        newSort.reverse();
      }
      return newSort;
    });
  }
  setDirectoryItems((prevItems) =>
    prevItems.sort((a) => {
      if (a.isDirectory) {
        return -1;
      }
      return 0;
    })
  );
}
