var Instruccion = require('./Instruccion');

class Break extends Instruccion{
    constructor(linea, columna, lenguaje, ambito, paqueteria){
        super(linea, columna, lenguaje, ambito, paqueteria, null);
    }


}

module.exports = Break;