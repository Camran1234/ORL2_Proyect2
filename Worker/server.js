const express = require('express')
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
var TablaTipos = require('./src/api/TablaTipos');
const { parser } = require('./src/parser/general/General');
var tablaTipos = null;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); 
app.use(cors());
 
let errores = [];

function parse(codigo){
    answer = [];
    errores = [];
    tablaTipos = new TablaTipos();
    let resultado = "false";
    const Parser = require('./src/parser/Parser');
    const Safe = require('./src/parser/Safe');
    let parser = new Parser(tablaTipos, 0);
    //Parseando
    parser.parse(codigo);
    
    if(!parser.haveErrores()){
        //Generamos el codigo3d
        let safe = new Safe();
        safe.guardarCodigo3D(parser.getCodigo3D());

    }        
    //Obteniendo errores
    errores = parser.getErrores();
    //Mensaje donde enviaremos la respuesta
    // Website you wish to allow to connect
    let jsonAnswer = {
        respuesta: parser.haveErrores()
    };
    let respuesta = JSON.stringify(jsonAnswer);
    respuesta= JSON.parse(respuesta);
    return respuesta;
}

app.post('/getCodigo3d', function(req, res) {
    const Safe = require('./src/parser/Safe');
    let safe = new Safe();
    let codigo = "";
    codigo = safe.obtenerCodigo3D();
    let jsonAnswer = {
        codigo: codigo 
    };
    res.send(JSON.parse(JSON.stringify(jsonAnswer)));
    res.end;
});

app.post('/codigo3d', function(req, res) {
    let codigo = req.body.codigo;
    let resultado = parse(codigo);
    res.send(resultado);
    res.end;
});

app.post('/parse', function (req, res) {
    let codigo = req.body.codigo;
    let resultado = parse(codigo);
    res.send(resultado);
    res.end;    
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

/*app.post('/obtenerResultado', function(req,res){
    res.send(JSON.stringify(answer));
});*/


app.listen(2000, () => {
    console.log("Creating server in http://worker:2000/");    
});
