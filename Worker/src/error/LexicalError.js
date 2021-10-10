import Error from './Error.js';

export default class LexicalError extends Error{

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