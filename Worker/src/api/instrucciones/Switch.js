var Instruccion = require('./Instruccion');

class Switch extends Instruccion {
    constructor(id, cases, linea, columna, lenguaje, ambito, paqueteria, instrucciones){
        super(linea, columna, lenguaje, ambito, paqueteria, instrucciones);
        this.id = id;
        this.cases = cases;
    }

    getId(){
        return this.id;
    }

    getCases(){
        return this.cases;
    }
}

module.exports = Switch;