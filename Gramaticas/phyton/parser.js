var fs = require('fs'); 
var parser = require('./Python');


fs.readFile('./entrada.txt', (err, data) => {
    if (err) throw err;
    parser.parse(data.toString());
    console.log("Entrada: ");
    console.log("\'"+data.toString()+"\'");
});
