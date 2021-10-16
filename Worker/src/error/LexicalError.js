var Error = require('./Error');

class LexicalError extends Error{

    constructor(lexema, linea, columna){
        super(linea, columna,"Error Lexico");
        this.lexema = lexema;
    }

    getMessage(){
        return "Simbolo no reconocido en el lenguaje";
    }

    getLexema(){
        return this.lexema;
    }

    toError(){
        var TIPO_ERROR = require('../api/InstruccionesApi').TIPO_ERROR;
        return TIPO_ERROR.errorLexico(this.lexema, this.linea, this.column);
    }
}

module.exports = LexicalError