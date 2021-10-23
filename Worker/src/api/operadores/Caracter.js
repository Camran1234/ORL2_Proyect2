var Entero = require('./Entero');
const TIPO_LENGUAJE  = require('../Instrucciones').TIPO_LENGUAJE;
class Caracter extends Entero {

    constructor(valor, linea, columna, lenguaje){
        super(valor,linea, columna, lenguaje);
    }

    type(){
        return "caracter";
    }

    tryParse(operador){
        if(this.lenguaje == TIPO_LENGUAJE.JAVA){
            if(operador instanceof Booleano){
                return null;
            }
        }
        if(operador instanceof Caracter){
            return new Entero(this.valor, this.linea, this.columna, this.lenguaje);
        }
        return null;
    }

}

module.exports = Caracter;