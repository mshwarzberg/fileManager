const fs = window.require("fs");

export function handleMoveToTrash(items, drive) {
  if (drive !== "tra") {
    fs.mkdirSync(drive + "trash", { recursive: true });
  }
  const trashedItems = JSON.parse(localStorage.getItem("trash")) || [];
  for (const item of items) {
    try {
      fs.renameSync(item.original, item.current);
      trashedItems.push(item);
    } catch (e) {
      console.log(e);
    }
  }
  localStorage.setItem("trash", JSON.stringify(trashedItems));
  return trashedItems;
}

export function restoreFromTrash(items) {
  const trashedItems = JSON.parse(localStorage.getItem("trash"));
  const remainingItems = [];

  for (const trashedItem of trashedItems) {
    if (
      items
        .map((item) => {
          return item.original;
        })
        .includes(trashedItem.original)
    ) {
      fs.renameSync(trashedItem.current, trashedItem.original);
    } else {
      remainingItems.push(trashedItem);
    }
  }
  localStorage.setItem("trash", JSON.stringify(remainingItems));
  return remainingItems;
}
