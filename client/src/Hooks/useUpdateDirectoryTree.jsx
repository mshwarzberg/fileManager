import { useCallback } from "react";

export default function useUpdateDirectoryTree() {
  const changeItem = useCallback((tree, array, currentIndex, newValue) => {
    for (let i in tree) {
      if (tree[i][0] === array[currentIndex] || tree[i] === array[currentIndex+1]) {
        tree[i] = changeItem(tree[i], array, currentIndex + 1, newValue);
      }
    }
    
    if (!tree[0]) {
      console.log('object');
      tree.push('root')
      tree = tree.concat(array)
    }
    if (currentIndex === array.length - 1) {
      for (let i in tree) {
        if (tree[i] === array[array.length - 1]) {
          tree.splice(tree.indexOf(array[currentIndex]), 1, [
            array[currentIndex],
            ...newValue,
          ]);
        }
      }
    }
    return tree;
  }, []);
  
  return changeItem
}