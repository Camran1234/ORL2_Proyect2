const TIPO_LENGUAJE  = require('../Instrucciones').TIPO_LENGUAJE;
var Object = require('./Object');
var Booleano = require('./Booleano');

class Cadena extends Object {

    constructor(valor, linea, columna, lenguaje){
        super(linea, columna, lenguaje);
        this.valor = valor;
    }

    getValor(){
        return this.valor;
    }

    type(){
        return "cadena";
    }

    tryParse(operador){
        if(lenguaje == TIPO_LENGUAJE.JAVA){
            if(operador instanceof Booleano){
                return null;
            }
        }
        return new Cadena(this.valor, this.linea, this.columna, this.lenguaje);
    }

}

module.exports = Cadena;