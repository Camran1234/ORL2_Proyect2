var Instruccion = require('./Instruccion');

class Variable extends Instruccion{

    constructor(declaraciones, asignaciones, linea, columna, lenguaje, ambito, paqueteria, instrucciones){
        super(linea, columna, lenguaje, ambito, paqueteria, instrucciones);
        this.declaraciones = declaraciones;
        this.asignaciones = asignaciones;
    }

    getDeclaraciones(){
        return this.declaraciones;
    }

    getAsignaciones(){
        return this.asignaciones;
    }

}

module.exports = Variable;