function checkIfFileOrDir(file) {
  var methods = ["isDirectory", "isFile"];

  // check if current item in directory is a file or a sub-directory
  var item = { name: file.name };
  for (var method of methods) {
    if (file[method]() === true) {
      item[method] = file[method]();
    }
  }
  return item;
}

module.exports = { checkIfFileOrDir }