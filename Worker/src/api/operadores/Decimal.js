var Number =require('./Number');
const TIPO_LENGUAJE  = require('../Instrucciones').TIPO_LENGUAJE;
class Decimal extends Number{

    constructor(valor,linea, columna, lenguaje){
        super(valor, linea, columna, lenguaje);
    }

    type(){
        return "decimal";
    }

    tryParse(operador){
        if(this.lenguaje == TIPO_LENGUAJE.JAVA){
            if(operador instanceof Booleano){
                return null;
            }
        }
        if(operador instanceof Decimal){
            return new Decimal(this.valor, this.linea, this.columna, this.lenguaje);
        }
        return null;
    }

}

module.exports = Decimal;