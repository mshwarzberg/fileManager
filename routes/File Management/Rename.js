const express = require("express");
const router = express.Router();
const fs = require("fs");

router.post("/", (req, res) => {
  let { originalPath, newPath } = req.body;

  try {
    fs.statSync(newPath);
    return res.send({ err: "File already exists with that name" });
  } catch (e) {
    try {
      fs.renameSync(originalPath, newPath);
      return res.send({});
    } catch (e) {
      console.log("managestuff rename", e.toString());
      return res.send({ err: "cannot change name" });
    }
  }
});

module.exports = router;
