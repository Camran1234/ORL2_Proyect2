
var Error = require('./Error');
class SemanticError extends Error{

    constructor(linea, columna){
        super(linea, columna, "Error Semantico");
    }


}

module.exports = SemanticError;