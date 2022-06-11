const express = require("express");
const app = express();
const sendfiledata = require("./routes/sendfiledata");
const loadfiles = require("./routes/loadfiles");
const senddirectories = require("./routes/senddirectories");
const updatedocument = require("./routes/updatedocument");
const senddirectorydata = require("./routes/senddirectorydata");
const managestuff = require("./routes/managestuff");

app.use(express.json());
app.listen(5000);

app.use("/api/data", sendfiledata);
app.use("/api/loadfiles", loadfiles);
app.use("/api/senddirectories", senddirectories);
app.use("/api/updatedocument", updatedocument);
app.use("/api/directorydata", senddirectorydata);
app.use("/api/manage", managestuff);
