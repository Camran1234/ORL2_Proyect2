var Instruccion = require('./Instruccion');

class Scanner extends Instruccion{

    constructor(variable, expresion, lenguaje, linea, columna, ambito, paqueteria){
        super(linea, columna, lenguaje, ambito, paqueteria, instrucciones);
        this.variable = variable;
        this.expresion = expresion;
    }

    getVariable(){
        return this.variable;
    }

    getExpresion(){
        return this.expresion;
    }

}

module.exports = Scanner;