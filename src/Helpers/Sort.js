export default function sortDirectoryItems(
  setDirectoryContent,
  method,
  descending
) {
  method = method.toLowerCase();
  if (method === "date") {
    method = "modified";
  } else if (method === "type") {
    method = "fileextension";
  }
  setDirectoryContent((prevItems) => {
    let newArray = [...prevItems];
    if (method === "name" || method === "fileextension") {
      newArray.sort((a, b) => {
        if (!parseInt(a[method]) && !parseInt(b[method])) {
          return a[method].localeCompare(b[method]);
        }
        return parseInt(a[method]) - parseInt(b[method]);
      });
    } else if (
      method === "size" ||
      method === "modified" ||
      method === "duration"
    ) {
      newArray.sort((a, b) => {
        if (b[method] === "") {
          b[method] = 0;
        }
        if (a[method] === "") {
          a[method] = 0;
        }
        return parseInt(b[method]) - parseInt(a[method]);
      });
    } else if (method === "dimensions") {
      newArray.sort((a, b) => {
        const aPixelCount =
          a.dimensions?.split("x")[0] * a.dimensions?.split("x")[1];
        const bPixelCount =
          b.dimensions?.split("x")[0] * b.dimensions?.split("x")[1];
        return parseInt(bPixelCount) - parseInt(aPixelCount);
      });
    } else if (method === "description") {
      newArray.sort((a, b) => {
        if (a.description) {
          return -1;
        }
        return 0;
      });
    }
    if (!descending) {
      return newArray.reverse();
    }
    return newArray;
  });
}
