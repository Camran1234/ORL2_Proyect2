var OperacionAritmetica = require('../OperacionAritmetica');
const Booleano = require('../../operadores/Booleano');
const Cadena = require('../../operadores/Cadena');
const Number = require('../../operadores/Number');
const Entero = require('../../operadores/Entero');
const ErrorSemantico = require('../../../error/SemanticError');
const TIPO_LENGUAJE  = require('../../Instrucciones').TIPO_LENGUAJE;

class Diferente extends OperacionAritmetica {

    constructor(operadorL, operadorR, linea, columna, lenguaje){
        super(operadorL, operadorR, linea, columna, lenguaje);
    }

    operar(errores){
        //Condicion de operacion
        if(this.operadorL instanceof Number && this.operadorR instanceof Number){
            if(this.lenguaje == TIPO_LENGUAJE.JAVA){
                return new Booleano("", this.linea, this.columna, this.lenguaje);
            }else{
                return new Entero("", this.linea, this.columna, this.lenguaje);
            }
        }else if(this.operadorL instanceof Cadena && this.operadorR instanceof Cadena){
            if(this.lenguaje == TIPO_LENGUAJE.JAVA){
                return new Booleano("", this.linea, this.columna, this.lenguaje);
            }else{
                return new Entero("", this.linea, this.columna, this.lenguaje);
            }
        }else{
            errores.push(new ErrorSemantico("Los operadores no son compatibles, numericos con numericos, cadenas con cadenas", "!=", this.linea, this.columna));
        }
        return null;
        //Fin de condicion
        
    }
}

module.exports = Diferente;