export default class Error{
    
    constructor(linea, columna){
        this.linea = linea;
        this.column = column;
    }

    getLine(){
        return this.linea;
    }

    getColumn(){
        return this.column;
    }
}