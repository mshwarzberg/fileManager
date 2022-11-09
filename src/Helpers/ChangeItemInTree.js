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

function handleDirectoryTree(tree, path, newValue) {
  for (const item of tree) {
    if (path?.startsWith(item.path) || path?.startsWith(item[0]?.path)) {
      if (item.path === path || item[0]?.path === path) {
        if (newValue) {
          tree.splice(tree.indexOf(item), 1, newValue);
        } else {
          tree.splice(tree.indexOf(item), 1);
        }
      } else if (item[0]) {
        tree = handleDirectoryTree(item, path, newValue);
      }
    }
  }
  return tree.filter((item) => item && item);
}

export { updateDirectoryTree, addToDirectoryTree, handleDirectoryTree };
