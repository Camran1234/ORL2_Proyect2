var Operacion = require('./Operacion');

class OperacionCondicional extends Operacion {

    constructor(operadorL, operadorR, linea, columna, lenguaje){
        super(operadorL, operadorR, linea, columna, lenguaje);
    }

}

module.exports = OperacionCondicional;