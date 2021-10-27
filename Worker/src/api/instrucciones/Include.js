var Instruccion = require('./Instruccion');

class Include extends Instruccion{
    constructor(instrucciones, linea, columna, lenguaje, ambito,paqueteria){
        super(linea, columna, lenguaje, ambito, paqueteria, instrucciones);
    }

}

module.exports = Include;