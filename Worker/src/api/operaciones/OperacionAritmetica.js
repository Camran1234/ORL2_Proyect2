var Operacion = require('./Operacion');

class OperacionAritmetica extends Operacion {

    constructor(operadorL, operadorR, linea, columna, lenguaje){
        super(operadorL, operadorR, linea, columna, lenguaje);
    }

    

}

module.exports = OperacionAritmetica;