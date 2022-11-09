import randomID from "../RandomID";

export default function formatDriveOutput(output) {
  return output
    .toString()
    .split("\r\r\n")
    .filter(
      (item) =>
        item && !item.startsWith("Name") && !item.startsWith("FileSystem")
    )
    .map((item) => {
      const driveInfo = item
        .trim()
        .split("  ")
        .filter((item) => item)
        .map((item) => {
          return item.trim();
        });
      let formatted;
      if (driveInfo.length > 2) {
        formatted = {
          isNetworkDrive: false,
          name: (driveInfo[4] || "Local Disk") + " (" + driveInfo[2] + ")",
          size: driveInfo[3],
          availableSpace: driveInfo[1],
          displayName:
            (driveInfo[4] || "Local Disk") + " (" + driveInfo[2] + ")",
          permission: true,
          path: driveInfo[2] + "/",
          isDrive: true,
          online: true,
          key: randomID(),
          fileSystem: driveInfo[0],
        };
      } else {
        formatted = {
          name: driveInfo[0] + "/",
          isNetworkDrive: true,
          displayName: "(" + driveInfo[0][0] + ")",
          permission: true,
          path: driveInfo[0] + "/",
          isDrive: true,
          online: false,
          key: randomID(),
        };
      }

      return formatted;
    });
}
