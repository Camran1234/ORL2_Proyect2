var Instruccion = require('./Instruccion');

class Continue extends Instruccion{

    constructor(linea, columna, lenguaje, ambito, paqueteria){
        super(linea, columna, lenguaje, ambito, paqueteria, null);
    }

}

module.exports = Continue;