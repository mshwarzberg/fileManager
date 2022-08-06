function addToDirectoryTree(tree, path, directories) {
  for (const i in tree) {
    const firstElement = tree[i][0];
    if (firstElement && path.startsWith(firstElement.path)) {
      tree.splice(i, 1, addToDirectoryTree(tree[i], path, directories));
    } else if (path.startsWith(tree[i].path) && path === tree[i].path) {
      directories.unshift({
        ...tree[i],
        collapsed: false,
      });
      tree.splice(i, 1, directories);
    }
  }
  return tree;
}
function expandAndCollapseDirectory(tree, path, bool) {
  if (!path) {
    for (let i = 1; i < tree.length - 1; i++) {
      if (tree[i][0]) {
        tree[i].splice(0, 1, {
          ...tree[i][0],
          collapsed: bool,
        });
      } else {
        tree.splice(i, 1, {
          ...tree[i],
          collapsed: bool,
        });
      }
    }
    return tree;
  }
  for (const i in tree) {
    const firstElement = tree[i][0];
    if (firstElement && path.startsWith(firstElement.path)) {
      tree.splice(i, 1, expandAndCollapseDirectory(tree[i], path, bool));
    } else if (path.startsWith(tree[i].path) && path === tree[i].path) {
      tree.splice(i, 1, {
        ...tree[i],
        collapsed: bool,
      });
    }
  }
  return tree;
}
function countTree(tree) {
  let num = 0;
  for (const subTree of tree) {
    num++;
    if (subTree[0]) {
      num += countTree(subTree);
    }
  }
  console.log(num);
  return num * 1;
}
export { expandAndCollapseDirectory, addToDirectoryTree, countTree };
