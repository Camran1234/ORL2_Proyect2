var fs = require('fs'); 
var parser = require('../../Worker/src/parser/general/General');


fs.readFile('./entrada.txt', (err, data) => {
    if (err) throw err;
    parser.parse(data.toString());
});