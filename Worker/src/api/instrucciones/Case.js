var Instruccion = require('./Instruccion');
class Case extends Instruccion{
    constructor(expresion, linea, columna, lenguaje, ambito, paqueteria, instrucciones){
        super(linea, columna, lenguaje, ambito, paqueteria, instrucciones);
        this.expresion = expresion;
        this.variableReferencia = null;
    }

    /**
     * Hace referencia al switch
     * @param {*} variable 
     */
    setVariableReferencia(variable){
        this.variableReferencia=variable;
    }

    getVariableReferencia(){
        return this.variableReferencia;
    }

    getExpresion(){
        return this.expresion;
    }

}

module.exports = Case;