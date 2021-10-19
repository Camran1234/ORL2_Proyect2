var Instruccion = require('./Instruccion');

class doWhile extends Instruccion{

    constructor(instrucciones, condicion, linea, columna, lenguaje, ambito, paqueteria){
        super(linea, columna, lenguaje, ambito, paqueteria, instrucciones);
        this.condicion = condicion;
    }

    getCondicion(){
        return this.condicion;
    }

}

module.exports = doWhile;