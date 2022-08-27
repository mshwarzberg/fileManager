const path = window.require("path");
const { execSync } = window.require("child_process");

export default function MoveToTrash(paths) {
  return new Promise((resolve, reject) => {
    const deleteTheseItems = paths;
    const setPermission =
      "powershell.exe Set-ExecutionPolicy -Scope CurrentUser remoteSigned";
    try {
      let output;
      execSync(setPermission);
      for (const deleteThing of deleteTheseItems) {
        const deleteItem = `powershell.exe -f "C:\\Users\\mshwa\\Downloads\\fileManager-master\\src\\Recycle.ps1" "${deleteThing}"`;
        output = execSync(deleteItem).toString();
        resolve();
        if (output.trim() === "Error") {
          reject(output.trim());
        }
      }
    } catch (e) {
      reject(e.toString());
    }
    resolve();
  });
}
