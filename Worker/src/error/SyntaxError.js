
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
}

module.exports = SyntaxError;