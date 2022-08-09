const express = require("express");
const router = express.Router();
const path = require("path");
const { execSync } = require("child_process");

router.post("/", (req, res) => {
  const deleteTheseItems = req.body.paths;
  const setPermission =
    "powershell.exe Set-ExecutionPolicy -Scope CurrentUser remoteSigned";
  try {
    let output;
    execSync(setPermission);
    for (const deleteThing of deleteTheseItems) {
      const deleteItem = `powershell.exe -f "${path.join(
        __dirname,
        "./Recycle.ps1"
      )}" "${deleteThing}"`;
      output = execSync(deleteItem, { stdio: "pipe" }).toString();
      if (output.trim() === "Error") {
        return res.send({ err: output.trim() }).status(404);
      }
    }
  } catch (e) {
    return res.status(401).send({ err: e.toString() });
  }
  res.send({ msg: "Successfully deleted" });
});

module.exports = router;
