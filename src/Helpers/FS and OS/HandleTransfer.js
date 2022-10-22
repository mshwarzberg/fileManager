import CompareFiles from "../../Components/Miscellaneous/CompareFiles";

const fs = window.require("fs");
const { exec } = window.require("child_process");

export function handleTransfer(destination, setPopup, clipboard, setClipboard) {
  const { source, mode, info } = clipboard;
  function transfer(sourcePath, name, destination, isFile) {
    let command = "";
    // use location for files and path for everything else
    if (!isFile) {
      command = `robocopy "${sourcePath}" "${destination}/${name}" ${
        mode === "copy" ? "" : "/move"
      }`;
    } else {
      command = `robocopy "${sourcePath}" "${destination}" "${name}" ${
        mode === "copy" ? "" : "/mov"
      }`;
    }

    try {
      exec(command, (err) => {
        if (err) console.log(err);
      });
    } catch (error) {}
  }

  if (source === destination) {
    if (mode === "cut") {
      setClipboard({});
      return;
    }
    for (const { fileextension, location, prefix } of info) {
      copyToSameDirectory(prefix, fileextension, location);
    }
  } else {
    const duplicates = checkForDuplicates(
      destination,
      info.map((item) => item.name)
    );
    if (duplicates[0]) {
      setPopup({
        body: (
          <div id="body">
            <h1 id="description">
              There {duplicates.length > 1 ? "are" : "is"} {duplicates.length}
              &nbsp;duplicate item{duplicates.length > 1 && "s"} in the
              destination
            </h1>
          </div>
        ),
        ok: (
          <button
            onClick={() => {
              // for (const { name, isFile, location } of info) {
              //   transfer(location, name, destination, isFile);
              // }
              // setPopup({});
            }}
          >
            Replace All
          </button>
        ),
        cancel: <button>Keep All</button>,
        thirdButton: (
          <button
            onClick={() => {
              setPopup((prevPopup) => {
                return {
                  body: (
                    <CompareFiles
                      duplicates={duplicates}
                      source={source}
                      destination={destination}
                    />
                  ),
                  ok: <button>Confirm Selections</button>,
                  cancel: (
                    <button
                      onClick={() => {
                        setPopup(prevPopup);
                      }}
                    >
                      Go Back
                    </button>
                  ),
                  popupLabel: <h1 id="popup-label">Compare Items</h1>,
                };
              });
            }}
          >
            Compare Items
          </button>
        ),
      });
      return;
    }
    for (const { path, location, isFile, name } of info) {
      transfer(isFile ? location : path, name, destination, isFile);
    }
  }
}

function checkForDuplicates(directory, itemNames) {
  const duplicates = [];
  for (const itemName of itemNames) {
    if (fs.readdirSync(directory).includes(itemName)) {
      duplicates.push(itemName);
    }
  }
  return duplicates;
}

// function copyItems(source, destination, isFile) {
//   const formatName = `"${source}" "${destination}"`.replaceAll("/", "\\");
//   if (isFile) {
//     const copy = `copy ${formatName}`;
//     try {
//       exec(copy);
//     } catch (error) {}
//   } else {
//     exec(`xcopy ${formatName}\\ /s /h /e`);
//   }
// }

// function moveItems(source, destination) {
//   const formatName = `"${source}" "${destination}"`.replaceAll("/", "\\");
//   exec(`move ${formatName}`);
// }

function copyToSameDirectory(prefix, fileextension, location) {
  const path = location + prefix + fileextension;
  function generateNameForCopiedItem() {
    while (true) {
      try {
        fs.accessSync(location + prefix + fileextension);
      } catch (error) {
        return location + prefix + fileextension;
      }
      prefix += " - Copy";
    }
  }

  const newPath = generateNameForCopiedItem();

  const command = `powershell.exe copy-item '${path.replaceAll(
    "'",
    "''"
  )}' '${newPath.replaceAll("'", "''")}' -recurse`;

  try {
    exec(command, (err) => {
      if (err) console.log(err);
    });
  } catch (error) {
    console.log(error);
  }
}
