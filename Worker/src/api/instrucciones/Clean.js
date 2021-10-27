var Instruccion = require('./Instruccion');

class Clean extends Instruccion{
    constructor(instrucciones, linea, columna, lenguaje, ambito,paqueteria){
        super(linea, columna, lenguaje, ambito, paqueteria, instrucciones);
    }

}

module.exports = Clean;