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
}

module.exports = LexicalError