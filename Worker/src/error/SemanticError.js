
var Error = require('./Error');
class SemanticError extends Error{

    constructor(descripcion, token,linea, columna){
        super(linea, columna, "Error Semantico");
        this.descripcion = descripcion;
        this.token = token;
    }

    toError(){
        let TIPO_ERROR = require('../api/InstruccionesApi').TIPO_ERROR;
        return TIPO_ERROR.errorSemantico(this.descripcion, this.token, this.linea, this.column);
    }

}

module.exports = SemanticError;