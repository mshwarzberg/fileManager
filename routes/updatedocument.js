const express = require("express");
const router = express.Router();
const fs = require("fs");

router.post("/", (req, res) => {
  try {
    fs.accessSync(req.body.path, fs.constants.R_OK);
  } catch {
    return res.send({ err: "Error Occurred" }).status(401);
  }
  fs.writeFile(
    req.body.path,
    req.body.document,
    {
      encoding: "utf8",
      flag: "w",
    },
    (err) => {
      if (err) {
        console.log(err);
      } else {
        return res.end();
      }
    }
  );
});

module.exports = router;
