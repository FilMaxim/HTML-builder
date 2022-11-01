const fs = require("fs");
const path = require("path");
const folderPath = "03-files-in-folder/secret-folder";
async function infoDir() {
  let arr = await fs.promises.readdir(folderPath, { withFileTypes: true })

  let result = arr.filter((item) => item.isFile());
  let arrFile = result.map((el) => el.name);
  let arrFileSize = [];

  for (let i = 0; i < arrFile.length; i++) {
    let stats = await fs.promises.stat(folderPath + "/" + arrFile[i]);
    arrFileSize.push(arrFile[i].split('.').join(' - ') + ' - ' + stats["size"] + 'byte');
    console.log(arrFileSize[i]);
  };
}
infoDir()

/*
fs.promises.readdir(folderPath, { withFileTypes: true }, function (err, items) {
  let result = items.filter((item) => item.isFile());
  let arrFile = result.map((el) => el.name);
  let arrFileSize = [];

  for (let i = 0; i < arrFile.length; i++) {
    fs.stat(folderPath + "/" + arrFile[i], function (err, stats) {
      arrFileSize.push(arrFile[i].split('.').join(' - ') + ' - ' + stats["size"] + 'byte');
      console.log(arrFileSize[i]);
    });
  }

})
*/