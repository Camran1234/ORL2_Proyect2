
var Decimal = require('./Decimal');

class Entero extends Decimal {

    constructor(valor, linea, columna, lenguaje){
        super(valor,linea, columna, lenguaje);
    }

    type(){
        return "entero";
    }

    tryParse(operador){
        if(lenguaje == TIPO_LENGUAJE.JAVA){
            if(operador instanceof Booleano){
                return null;
            }
        }
        if(operador instanceof Entero){
            return new Entero(this.valor, this.linea, this.columna, this.lenguaje);
        }
        return null;
    }

}

module.exports = Entero;