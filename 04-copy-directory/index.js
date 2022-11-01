var fs = require('fs');
var path = require('path');
fs.mkdir('04-copy-directory/files-copy', err => {
    fs.readdir("04-copy-directory/files", {recursive: true}, function (err, items) {
        if(err) throw err;
    for (let i = 0; i < items.length; i++) {
        fs.copyFile(`04-copy-directory/files/${items[i]}`, `04-copy-directory/files-copy/${items[i]}`, err => {

            if(err) throw err;
         });
         //удаление файла
         fs.readdir("04-copy-directory/files-copy", {recursive: true}, function (err, itemsCopy) {
            for (let i = 0; i < itemsCopy.length; i++) {
                if (!items.includes(itemsCopy[i])) {
                    fs.unlink(`04-copy-directory/files-copy/${itemsCopy[i]}`, err => {})
                }
            }
         })
    }
 })
})