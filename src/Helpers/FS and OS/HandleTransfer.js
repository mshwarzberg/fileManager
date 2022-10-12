const fs = window.require("fs");
const { execSync } = window.require("child_process");

function checkForDuplicates(directory, itemNames) {
  const duplicates = [];
  for (const itemName of itemNames) {
    if (fs.readdirSync(directory).includes(itemName)) {
      duplicates.push(itemName);
    }
  }
  return duplicates;
}

function copyItems(source, destination, isDirectory) {
  const formatName = `"${source}" "${destination}"`.replaceAll("/", "\\");
  if (!isDirectory) {
    const copy = `copy ${formatName}`;
    execSync(copy);
  } else {
    execSync(`xcopy ${formatName}\\ /s /h /e`);
  }
}

function moveItems(source, destination) {
  const formatName = `"${source}" "${destination}"`.replaceAll("/", "\\");
  execSync(`move ${formatName}`);
}

function transfer(info, mode, destination, setClipboard) {
  for (const { path, name, isDirectory } of info) {
    if (mode === "cut") {
      moveItems(path, destination + name);
      setClipboard({});
    } else {
      copyItems(path, destination + name, isDirectory);
    }
  }
}

export function handleTransfer(contextMenu, clipboard, setPopup, setClipboard) {
  const { items, destination } = contextMenu;
  const { source, mode, copy, info } = clipboard;

  if (source === destination) {
    if (mode === "cut") {
      setClipboard({});
      return;
    }
    for (const { path, fileextension, isDirectory } of info) {
      const newName =
        path.slice(0, path.length - fileextension.length) +
        " - Copy" +
        fileextension;
      copyItems(path, newName, isDirectory);
    }
    return;
  }

  const duplicates = checkForDuplicates(
    destination,
    info.map(({ name }) => {
      return name;
    })
  );

  if (duplicates[0]) {
    setPopup({
      show: true,
      body: (
        <div id="body" data-title={JSON.stringify(duplicates)}>
          There are {duplicates.length} duplicate items in the destination
        </div>
      ),
      ok: (
        <button
          onClick={() => {
            transfer(info, mode, destination, setClipboard);
            setPopup({});
          }}
        >
          Replace All
        </button>
      ),
      cancel: (
        <button
          onClick={() => {
            setPopup({});
          }}
        >
          Cancel
        </button>
      ),
      thirdButton: <button>Compare Items</button>,
    });
  } else {
    transfer(info, mode, destination, setClipboard);
  }
}
