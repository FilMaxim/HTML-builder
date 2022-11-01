const fs = require("fs");
const path = require("path");
const { exit } = require("process");
const { stdin, stdout } = process;

fs.open("02-write-file/textTest.txt", "w", (err) => {
  if (err) throw err;
  stdout.write("Hello, my friend! Enter text:\n");
  stdin.on("data", (data) => {
    if (data.toString().trim() === 'exit') {
        bye();
    }
    fs.appendFile("02-write-file/textTest.txt", data, (err) => {
      if (err) throw err;
    });
  });

});

process.on('SIGINT', bye)
  function bye() {
    stdout.write('Good luck my friend!');
    exit()
  }