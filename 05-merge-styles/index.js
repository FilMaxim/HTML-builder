var fs = require('fs');
var path = require('path');
fs.open("05-merge-styles/project-dist/bundle.css", "w", (err) => {
    if (err) throw err;
})
fs.readdir("05-merge-styles/styles", {recursive: true}, function (err, items) {
    if(err) throw err;
    let sortItems = items.filter(el =>
        el.slice(el.length - 4) === '.css'
    )
    for (let i = 0; i < sortItems.length; i++) {
        const stream = fs.createReadStream(`05-merge-styles/styles/${sortItems[i]}`);
        let data = '';
        stream.on('data', chunk => data += chunk);
        stream.on('end', () => {
            fs.appendFile("05-merge-styles/project-dist/bundle.css", data + '\n', (err) => {
            if (err) throw err;
          });


        });
        stream.on('error', error => console.log('Error', error.message));
    }
})