export default function changeItem(tree, parentArray, currentIndex, newValue) {
  if (!tree[0] && tree.length === 1) {
    tree = tree.concat(parentArray);
    return tree;
  }
  if (typeof newValue === "string") {
    for (let i in tree) {
      if (
        tree[i][0] === parentArray[currentIndex] &&
        currentIndex !== parentArray.length - 1
      ) {
        tree[i] = changeItem(tree[i], parentArray, currentIndex + 1, newValue);
      }
      if (currentIndex === parentArray.length - 1) {
        for (let i in tree) {
          if (tree[i][0] === parentArray[currentIndex]) {
            tree[i] = newValue;
            break;
          }
        }
      }
    }
    return tree;
  } else if (typeof newValue === "object") {
    for (let i in tree) {
      if (tree[i][0] === parentArray[currentIndex]) {
        tree[i] = changeItem(tree[i], parentArray, currentIndex + 1, newValue);
      }
    }
    if (currentIndex === parentArray.length - 1) {
      for (let i in tree) {
        if (typeof tree[i] === "object") {
          tree[i] = changeItem(tree[i], parentArray, currentIndex, newValue);
        }
        if (tree[i] === parentArray[parentArray.length - 1]) {
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
