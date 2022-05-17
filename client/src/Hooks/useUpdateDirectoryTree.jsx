import { useCallback } from "react";

export default function useUpdateDirectoryTree() {
  const changeItem = useCallback((tree, parentArray, currentIndex, newValue, getArrayLength) => {
    if (parentArray[0] === '' && parentArray.length === 1) {
      let newTree = []
      for (let i in tree) {
        if (typeof tree[i] === 'string') {
          newTree.push(tree[i])
        } else {
          newTree.push(tree[i][0])
        }
      }
      return newTree
    }
    if (typeof newValue === 'string') {
      for (let i in tree) {
        if (tree[i][0] === parentArray[currentIndex] && currentIndex !== parentArray.length - 1) {
          tree[i] = changeItem(tree[i], parentArray, currentIndex+1, newValue, getArrayLength)
        }
        if (currentIndex === parentArray.length - 1) {
          for (let i in tree) {
            if (tree[i][0] === parentArray[currentIndex]){
              tree[i] = newValue
              break
            }
          }
        }
      }
      return tree
    }
    for (let i in tree) {
      if (tree[i][0] === parentArray[currentIndex]) {
        tree[i] = changeItem(tree[i], parentArray, currentIndex + 1, newValue);
      }
    }
    if (!tree[0]) {
      tree = tree.concat(parentArray)
    }
    if (currentIndex === parentArray.length - 1) {
      for (let i in tree) {
        if (tree[i] === parentArray[parentArray.length - 1]) {
          tree.splice(tree.indexOf(parentArray[currentIndex]), 1, [
            parentArray[currentIndex],
            ...newValue,
          ]);
        }
      }
    }
    return tree;
  }, []);
  
  return changeItem
}
