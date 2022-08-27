import FormatDriveOutput from "../../../Helpers/FS and OS Helpers/FormatDriveOutput";

export default function getDrives() {
  return new Promise(async (resolve, reject) => {
    resolve(await FormatDriveOutput());
  });
}
