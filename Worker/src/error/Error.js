class Error{
    constructor(linea, column, tipo){
        this.linea = linea;
        this.column = column;
        this.tipo = tipo;
    }

    getLine(){
        return this.linea;
    }

    getColumn(){
        return this.column;
    }

    getType(){
        return this.tipo;
    }
}
module.exports = Error;
