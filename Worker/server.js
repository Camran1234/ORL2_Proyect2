const express = require('express')
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
var Parser = require('./src/parser/Parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); 
app.use(cors());
 
let answer = [];
let errores = [];

app.post('/parse', function (req, res) {
    answer = [];
    errores = [];
    let codigo  = req.body.codigo;
    console.log('Codigo recibido: '+codigo);
    let resultado = "false";
    let parser = new Parser();
    parser.parse(codigo);
    //Mensaje donde enviaremos la respuesta
    // Website you wish to allow to connect
    let jsonAnswer = {
        respuesta: "resultado"
    };
    let respuesta = JSON.stringify(jsonAnswer);
    respuesta= JSON.parse(respuesta);
    res.send(respuesta);
  });

app.post('/obtenerErrores', function (req, res){
    res.send(JSON.stringify(errores));
});

app.post('/obtenerResultado', function(req,res){
    res.send(JSON.stringify(answer));
});


app.listen(2000, () => {
    console.log("Creating server in http://worker:2000/");    
});
