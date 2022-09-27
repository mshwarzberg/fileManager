const { exec } = window.require("child_process");
export default function clickOnItem(item, dispatch) {
  const {
    isNetworkDrive,
    isDirectory,
    isDrive,
    name,
    location,
    isFile,
    path,
    isSymbolicLink,
    linkTo,
  } = item;
  if (isDrive) {
    dispatch({
      type: "open",
      value: path,
    });
    dispatch({
      type: "drive",
      value: path,
    });
    if (isNetworkDrive) {
      dispatch({
        type: "addNetworkDrive",
        value: path,
      });
    }
  } else if (isFile) {
    exec(`"${location + name}"`);
  } else if (isDirectory) {
    dispatch({
      type: "open",
      value: location + name + "/",
    });
  } else if (isSymbolicLink) {
    dispatch({
      type: "open",
      value: linkTo + "/",
    });
  } else {
    console.log("?");
  }
}
