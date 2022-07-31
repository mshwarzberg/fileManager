const express = require("express");
const app = express();

const FilesAndFolders = require("./routes/Metadata/FilesAndDirectories");
const DirectoryTree = require("./routes/Metadata/DirectoryTree");
const ChooseDrive = require("./routes/Metadata/Drives");
const MediaMetadata = require("./routes/Metadata/MediaMetadata");

const Rename = require("./routes/File Management/Rename");
const Transfer = require("./routes/File Management/Transfer");
const Delete = require("./routes/File Management/Delete");
const NewDirectory = require("./routes/File Management/NewDirectory");
const OpenItem = require("./routes/File Management/OpenItem");

const SizeAndContents = require("./routes/Metadata/Directory/SizeAndContents");
const DateData = require("./routes/Metadata/Directory/DateData");

app.use(express.json());
app.listen(5000);

app.use("/api/metadata", FilesAndFolders);
app.use("/api/directorytree", DirectoryTree);

app.use("/api/directorydata/getsize", SizeAndContents);
app.use("/api/directorydata/getdatedata", DateData);

app.use("/api/getdrives", ChooseDrive);
app.use("/api/mediametadata", MediaMetadata);

app.use("/api/manage/rename", Rename);
app.use("/api/manage/transfer", Transfer);
app.use("/api/manage/delete", Delete);
app.use("/api/manage/newdirectory", NewDirectory);
app.use("/api/manage/open", OpenItem);
