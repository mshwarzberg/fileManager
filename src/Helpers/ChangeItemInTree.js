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
function updateDirectoryTree(tree, path, obj) {
  if (!path) {
    for (let i = 1; i < tree.length - 1; i++) {
      if (tree[i][0]) {
        tree[i].splice(0, 1, {
          ...tree[i][0],
          ...obj,
        });
      } else {
        tree.splice(i, 1, {
          ...tree[i],
          ...obj,
        });
      }
    }
    return tree;
  }
  for (const i in tree) {
    const firstElement = tree[i][0];
    if (firstElement && path.startsWith(firstElement.path)) {
      tree.splice(i, 1, updateDirectoryTree(tree[i], path, obj));
    } else if (path.startsWith(tree[i].path) && path === tree[i].path) {
      tree.splice(i, 1, {
        ...tree[i],
        ...obj,
      });
    }
  }
  return tree;
}
function removeFromDirectoryTree(tree, path) {
  if (!path) {
    for (let i = 1; i < tree.length - 1; i++) {
      if (tree[i][0]) {
        tree[i].splice(0, 1, {});
      } else {
        tree.splice(i, 1, {});
      }
    }
    return tree;
  }
  for (const i in tree) {
    const firstElement = tree[i][0];
    if (firstElement && path.startsWith(firstElement.path)) {
      tree.splice(i, 1, removeFromDirectoryTree(tree[i], path));
    } else if (path.startsWith(tree[i].path) && path === tree[i].path) {
      tree.splice(i, 1, {});
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
  return num * 1;
}
export {
  updateDirectoryTree,
  addToDirectoryTree,
  countTree,
  removeFromDirectoryTree,
};
