import FormatDriveOutput from "../../../Helpers/FS and OS Helpers/FormatDriveOutput";

const { execSync } = window.require("child_process");

export default async function initialDirectoryTree() {
  return new Promise(async (resolve, _) => {
    const username = execSync("echo %username%").toString().split("\r")[0];
    let defaultTree = await FormatDriveOutput();
    if (username) {
      const directories = [
        "Videos",
        "Pictures",
        "Music",
        "Downloads",
        "Documents",
        "Desktop",
      ];

      for (let directory of directories) {
        defaultTree.unshift({
          name: directory,
          path: `C:/Users/${username}/${directory}/`,
          permission: true,
          type: "default",
          isDirectory: true,
          collapsed: true,
        });
      }
    }

    resolve(defaultTree);
  });
}
