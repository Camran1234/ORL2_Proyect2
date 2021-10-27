import Error from './Error.js';

export default class LexicalError extends Error{

    constructor(lexema, linea, columna){
        super(linea, columna);
        this.lexema = lexema;
    }

    getMessage(){
        let mensaje = "Error Lexico, en el lexema: "+this.lexema+", linea: "+this.linea+", columna: "+this.column;
    }

    getLexema(){
        return this.lexema;
    }

}