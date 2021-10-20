var Object = require('./Object');

class Number extends Object{
    constructor(valor, linea, columna, lenguaje){
        super(valor, linea, columna, lenguaje);
    }

    type(){
        return Number;
    }

    tryParse(){
        
    }

}

module.exports =Number;