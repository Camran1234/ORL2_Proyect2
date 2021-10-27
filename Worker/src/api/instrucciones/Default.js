var Instruccion = require('./Instruccion');
class Default extends Instruccion{
    constructor(linea, columna, lenguaje, ambito, paqueteria, instrucciones){
        super(linea, columna, lenguaje, ambito, paqueteria, instrucciones);
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

}

module.exports = Default;