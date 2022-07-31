export default function changeItem(tree, parentArray, currentIndex, newValue) {
  if (typeof newValue === "string") {
    for (let thing of tree) {
      if (
        thing[0] === parentArray[currentIndex] &&
        currentIndex !== parentArray.length - 1
      ) {
        tree.splice(
          tree.indexOf(thing),
          1,
          changeItem(thing, parentArray, currentIndex + 1, newValue)
        );
      }
      if (currentIndex === parentArray.length - 1) {
        for (let thing of tree) {
          if (thing[0] === parentArray[currentIndex]) {
            tree.splice(tree.indexOf(thing), 1, newValue);
            break;
          }
        }
      }
    }
    return tree;
  } else if (typeof newValue === "object") {
    for (let thing of tree) {
      if (thing[0] === parentArray[currentIndex]) {
        thing = changeItem(thing, parentArray, currentIndex + 1, newValue);
      }
    }
    if (currentIndex === parentArray.length - 1) {
      for (let thing of tree) {
        if (typeof thing === "object") {
          thing = changeItem(thing, parentArray, currentIndex, newValue);
        }
        if (thing === parentArray[parentArray.length - 1]) {
          tree.splice(tree.indexOf(parentArray[currentIndex]), 1, [
            parentArray[currentIndex],
            ...newValue,
          ]);
        }
      }
    }
  }

  return tree;
}
