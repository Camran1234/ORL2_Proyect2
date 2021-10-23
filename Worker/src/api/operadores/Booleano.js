var Caracter = require('./Caracter');
const TIPO_LENGUAJE  = require('../Instrucciones').TIPO_LENGUAJE;
class Booleano extends Caracter{

    constructor(valor, linea, columna, lenguaje){
        super(valor, linea, columna, lenguaje);
    }

    type(){
        return "booleano";
    }

    tryParse(operador){
        if(operador instanceof Booleano){
            return new Booleano(this.valor, this.linea, this.columna, this.lenguaje);
        }
        return null;
    }

}

module.exports = Booleano;