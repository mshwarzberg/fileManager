const express = require("express");
const router = express.Router();
const { formatdriveoutput } = require("../../helpers/formatdriveoutput");

router.get("/", async (_, res) => {
  res.send(await formatdriveoutput());
});

module.exports = router;
