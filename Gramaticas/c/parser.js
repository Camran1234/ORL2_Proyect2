var fs = require('fs'); 
var parser = require('./C');


fs.readFile('./entrada.txt', (err, data) => {
    if (err) throw err;
    parser.parse(data.toString());
    console.log("Texto Parseado: ");
    console.log(data.toString());
});