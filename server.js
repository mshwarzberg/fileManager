const express = require("express");
const app = express();

const FilesAndFolders = require("./routes/Metadata/FilesAndDirectories");
const DirectoryTree = require("./routes/Metadata/DirectoryTree");
const ChooseDrive = require("./routes/Metadata/Drives");
const Thumbnails = require("./routes/Metadata/MediaMetadata");

const Rename = require("./routes/File Management/Rename");
const Transfer = require("./routes/File Management/Transfer");
const Delete = require("./routes/File Management/Delete");
const NewDirectory = require("./routes/File Management/NewDirectory");

const SizeAndContents = require("./routes/Metadata/Directory/SizeAndContents");
const DateData = require("./routes/Metadata/Directory/DateData");

const loaddisplayfiles = require("./routes/Load Display/loaddisplayfiles");

app.use(express.json());
app.listen(5000);

app.use("/api/metadata", FilesAndFolders);
app.use("/api/loadfiles", loaddisplayfiles);
app.use("/api/senddirectories", DirectoryTree);

app.use("/api/directorydata/getsize", SizeAndContents);
app.use("/api/directorydata/getdatedata", DateData);

app.use("/api/getdrives", ChooseDrive);
app.use("/api/getthumbnails", Thumbnails);

app.use("/api/manage/rename", Rename);
app.use("/api/manage/transfer", Transfer);
app.use("/api/manage/delete", Delete);
app.use("/api/manage/newdirectory", NewDirectory);
