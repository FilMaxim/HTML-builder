var fs = require("fs");
var path = require("path");
//создание папки
fs.mkdir("06-build-page/project-dist", {recursive: true}, (err) => {
  if (err) throw err; // не удалось создать папку
});



// копией папки assets
fs.mkdir("06-build-page/project-dist/assets", {recursive: true}, (err) => {
    if (err) throw err; // не удалось создать папку
})


fs.readdir("06-build-page/assets", { withFileTypes: true }, function (err, items) {
    if(err) throw err;
    let arrDirectory = items.filter((item) => item.isDirectory());//массив директорий в папке assets
    let arrFile = items.filter((item) => item.isFile());////массив файов в папке assets


    //запись файлов в папку  assets
    for (let i = 0; i < arrFile.length; i++) {
        fs.copyFile(`06-build-page/assets/${arrFile[i].name}`, `06-build-page/project-dist/assets/${arrFile[i].name}`, err => {
        if(err) throw err;
     });
    }

    fs.readdir("06-build-page/project-dist/assets", { withFileTypes: true }, function (err, elFileProject) { //удаление файлов из project-dist/assets если таких нет в assets
        let arrFileProject = elFileProject.filter((item) => item.isFile());
        for (let i = 0; i < arrFileProject.length; i++) {
            if (!arrFile.includes(arrFileProject[i])) {
                fs.unlink(`06-build-page/project-dist/assets/${arrFileProject[i].name}`, err => {})
            }
        }
     })

     // создание директорий в папку project-dist/assets и копирование файлов

    for (let i = 0; i < arrDirectory.length; i++) {

        fs.mkdir(`06-build-page/project-dist/assets/${arrDirectory[i].name}`, {recursive: true}, (err) => {//создаие директорий в
            if (err) throw err;

        })


        fs.readdir(`06-build-page/assets/${arrDirectory[i].name}`, { withFileTypes: true }, function (err, fileInDirectory) {
            if(err) throw err;
            let fileInDirectoryNew = fileInDirectory.filter((item) => item.isFile());////массив файлов в папке assets в подпапках

            let fileInDirectoryNew2 = fileInDirectoryNew.map(e => e.name) //массив только из имен


            for (let j = 0; j < fileInDirectoryNew.length; j++) {
                fs.copyFile(`06-build-page/assets/${arrDirectory[i].name}/${fileInDirectoryNew[j].name}`, `06-build-page/project-dist/assets/${arrDirectory[i].name}/${fileInDirectoryNew[j].name}`, err => {
                if(err) throw err;
                })
                // проверка на присутствие файла в project-dist/assets/ в директориях
                fs.readdir(`06-build-page/project-dist/assets/${arrDirectory[i].name}`, {recursive: true}, function (err, fileInDirProject) {
                    if(err) throw err;
                    for (let k = 0; k < fileInDirProject.length; k++) {
                        if (!fileInDirectoryNew2.includes(fileInDirProject[k])) {
                            fs.unlink(`06-build-page/project-dist/assets/${arrDirectory[i].name}/${fileInDirProject[k]}`, err => {})
                        }
                        if(err) throw err;
                     };
                    })
            }
        })
    }
})

//Собирает в единый файл стили из папки styles и помещает их в файл project-dist/style.css.
fs.open("06-build-page/project-dist/style.css", "w", (err) => {
    if (err) throw err;
})
fs.readdir("06-build-page/styles", {recursive: true}, function (err, items) {
    if(err) throw err;
    let sortItems = items.filter(el =>
        el.slice(el.length - 4) === '.css'
    );
    sortItems = sortItems.reverse()
    //console.log(sortItems)
    for (let i = 0; i < sortItems.length; i++) {
        const stream = fs.createReadStream(`06-build-page/styles/${sortItems[i]}`);
        let data = '';
        stream.on('data', chunk => data += chunk);
        stream.on('end', () => {
            fs.appendFile("06-build-page/project-dist/style.css", data + '\n', (err) => {
            if (err) throw err;
          });


        });
        stream.on('error', error => console.log('Error', error.message));
    }
})

//Запись изменённого шаблона в файл index.html в папке project-dist

const projectPach = path.join(__dirname, 'project-dist');
const templatePach = path.join(__dirname, 'template.html');
const componentsPach = path.join(__dirname, 'components');

async function htmlsort() {
    let dataTemplate = await fs.promises.readFile(templatePach, 'utf-8');
    let arr = await fs.promises.readdir(componentsPach, {withFileTypes: true})
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].isFile && path.extname(arr[i].name) === '.html') {
            let filePach = path.join(componentsPach, arr[i].name);
            let data = await fs.promises.readFile(filePach, 'utf-8');
            dataTemplate = dataTemplate.replace(`{{${path.basename(arr[i].name, '.html')}}}`, data);
        }
    }
    fs.writeFile(path.join(projectPach,'index.html'), dataTemplate, err => {
        if (err) throw err;
    })
}
htmlsort()
