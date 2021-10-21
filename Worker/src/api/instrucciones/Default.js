var Instruccion = require('./Instruccion');
class Default extends Instruccion{
    constructor(linea, columna, lenguaje, ambito, paqueteria, instrucciones){
        super(linea, columna, lenguaje, ambito, paqueteria, instrucciones);
    }

}

module.exports = Default;