
var Error = require('./Error');
class SyntaxError extends Error{

    constructor(descripcion, token,  linea, columna){
        super(linea, columna, "Error Sintactico");
        this.descripcion = descripcion;
        this.token = token;
    }

    getMessage(){
        return this.descripcion;
    }

    getToken(){
        return this.token;
    }

    toError(){
        var TIPO_ERROR = require('../api/InstruccionesApi').TIPO_ERROR;
        return TIPO_ERROR.errorSintactico(this.descripcion, this.token, this.linea, this.column);
    }
}

module.exports = SyntaxError;