var Operacion = require('./Operacion');

class OperacionComparacion extends Operacion {

    constructor(operadorL, operadorR, linea, columna, lenguaje){
        super(operadorL, operadorR, linea, columna, lenguaje);
    }

}

module.exports = OperacionComparacion;