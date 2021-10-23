const express = require('express')
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
var TablaTipos = require('./src/api/TablaTipos');
var tablaTipos = null;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); 
app.use(cors());
 
let answer = [];
let errores = [];

app.post('/parse', function (req, res) {
    answer = [];
    errores = [];
    tablaTipos = new TablaTipos();
    
    let codigo  = req.body.codigo;
    console.log(codigo);
    let resultado = "false";
    let Parser = require('./src/parser/Parser');
    let parser = new Parser(tablaTipos, 0);
    //Parseando
    parser.parse(codigo);
    //Obteniendo errores
    errores = parser.getErrores();
    //Mensaje donde enviaremos la respuesta
    // Website you wish to allow to connect
    let jsonAnswer = {
        respuesta: parser.haveErrores()
    };
    let respuesta = JSON.stringify(jsonAnswer);
    respuesta= JSON.parse(respuesta);
    res.send(respuesta);
    res.end();
  });

app.post('/obtenerErrores', function (req, res){
    let jsonString = [];
    console.log(JSON.stringify(errores));
    let jsonRespuesta = {
        respuesta: errores
    }
    let respuesta = JSON.parse(JSON.stringify(jsonRespuesta));
    res.send(JSON.stringify(respuesta));
    res.end();
});

app.post('/obtenerResultado', function(req,res){
    res.send(JSON.stringify(answer));
});


app.listen(2000, () => {
    console.log("Creating server in http://worker:2000/");    
});
