var Instruccion = require('./Instruccion');

class If extends Instruccion{
    constructor(condicion, linea, columna, lenguaje, ambito, paqueteria, instrucciones){
        super(linea, columna, lenguaje, ambito, paqueteria, instrucciones);
        this.condicion = condicion;
    }

    getCondicion(){
        return this.condicion;
    }

}

module.exports =If;