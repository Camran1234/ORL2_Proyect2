var Instruccion = require('./Instruccion');

class Variable extends Instruccion{

    constructor(declaraciones, asignaciones, linea, columna, lenguaje, ambito, paqueteria, instrucciones){
        super(linea, columna, lenguaje, ambito, paqueteria, instrucciones);
        this.declaraciones = declaraciones;
        this.asignaciones = asignaciones;
        this.ast = null;
    }

    setAst(ast){
        this.ast = ast;
    }

    getAst(){
        return this.ast;
    }

    getDeclaraciones(){
        return this.declaraciones;
    }

    getAsignaciones(){
        return this.asignaciones;
    }

}

module.exports = Variable;