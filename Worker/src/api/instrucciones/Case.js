var Instruccion = require('./Instruccion');
class Case extends Instruccion{
    constructor(expresion, linea, columna, lenguaje, ambito, paqueteria, instrucciones){
        super(linea, columna, lenguaje, ambito, paqueteria, instrucciones);
        this.expresion = expresion;
    }

    getExpresion(){
        return this.expresion;
    }

}

module.exports = Case;