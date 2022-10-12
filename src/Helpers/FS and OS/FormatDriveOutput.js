const { execSync } = window.require("child_process");

export default function formatDriveOutput() {
  return new Promise((resolve, _) => {
    let output = execSync(
      "wmic logicaldisk get caption,drivetype, size, freespace, volumename /format:Textvaluelist"
    );
    const sortedDrives = [];
    output = output.toString().split("\n");
    for (const i in output) {
      if (output[i].startsWith("Caption")) {
        const name = `${
          output[i * 1 + 4].split("\r\r")[0].split("=")[1] || "Local Disk"
        } (${output[i].split("=")[1].split("\r\r")[0]})`;
        sortedDrives.push({
          name: name,
          displayName: name,
          isNetworkDrive: parseInt(output[i * 1 + 1].split("=")[1]) === 4,
          totalSize: parseInt(output[i * 1 + 3].split("=")[1]),
          availableSpace: parseInt(output[i * 1 + 2].split("=")[1]),
          permission: true,
          isDrive: true,
          path: output[i].split("=")[1].split("\r\r")[0] + "/",
        });
      }
    }
    resolve(sortedDrives);
  });
}
