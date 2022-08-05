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

export { expandAndCollapseDirectory, addToDirectoryTree };
